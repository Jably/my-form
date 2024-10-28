// src/components/RegistrationConfirmation.tsx
'use client';
import { Card, Button, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PaymentSuccess from './PaymentSuccess';

const generateUniqueOrderId = () => {
  const orderId = Math.floor(1000 + Math.random() * 9000);
  return orderId.toString();
};

export const RegistrationConfirmation = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => { 
  const formData = useSelector((state: RootState) => state.form);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null); 
  const [orderId, setOrderId] = useState<string | null>(null); 
  const [paymentSuccess, setPaymentSuccess] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // State untuk status pembayaran

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    if (paymentStatus === 'pending') {
      cancelTransaction(); // Panggil fungsi untuk membatalkan transaksi
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [paymentStatus]);

  const handlePayment = async () => {
    if (isProcessing || snapToken) {
      showModal('Info', 'Pembayaran sedang diproses atau transaksi pending. Silakan cek status transaksi.');
      return;
    }

    try {
      setIsProcessing(true);
      const newOrderId = generateUniqueOrderId();
      setOrderId(newOrderId); 
      const amount = getPrice(formData.category, formData.option);

      const customerDetails = {
        first_name: formData.fullName.split(" ")[0],
        last_name: formData.fullName.split(" ")[1] || '',
        email: formData.email,
        phone: formData.phone,
      };

      const response = await axios.post('/api/payment', {
        amount,
        orderId: newOrderId,
        customerDetails,
        formData,
      });

      if (response.data.token) {
        setSnapToken(response.data.token); 
        setPaymentStatus('pending'); // Set status pending ke state
        window.snap.pay(response.data.token, {
          onSuccess: (result) => {
            console.log('Payment successful:', result);
            showModal('Pembayaran Berhasil', 'Pembayaran Anda telah berhasil!');
            setPaymentSuccess(true); 
            setPaymentStatus(null); // Hapus status setelah sukses
          },
          onPending: (result) => {
            console.log('Payment pending:', result);
            showModal('Pembayaran Pending', `Pembayaran masih dalam proses. Order ID: ${newOrderId}`);
            setIsProcessing(false);
          },
          onError: (result) => {
            console.error('Payment error:', result);
            showModal('Pembayaran Gagal', 'Pembayaran gagal.');
            resetTransaction();
          },
          onClose: () => {
            console.log('Payment dialog closed');
            showModal('Dialog Ditutup', snapToken && orderId ? `Transaksi dalam status pending. Order ID: ${orderId}` : 'Transaksi On Pending.');
            setIsProcessing(false);
          },
        });
      }
    } catch (error: unknown) {
      setIsProcessing(false);
      if (axios.isAxiosError(error)) {
        console.error('Payment error:', error.response?.data);
        showModal('Pembayaran Gagal', `Pembayaran gagal: ${error.response?.data.message || 'Silakan coba lagi.'}`);
      } else {
        console.error('Unexpected error:', error);
        showModal('Pembayaran Gagal', 'Pembayaran gagal, silakan coba lagi.');
      }
    }
  };

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const continuePayment = () => {
    if (snapToken && orderId) {
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log('Payment successful:', result);
          showModal('Pembayaran Berhasil', 'Pembayaran Anda telah berhasil!');
          resetTransaction();
          setPaymentStatus(null); // Hapus status setelah sukses
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          showModal('Pembayaran Pending', `Pembayaran masih dalam proses. Order ID: ${orderId}`);
        },
        onError: (result) => {
          console.error('Payment error:', result);
          showModal('Pembayaran Gagal', 'Pembayaran gagal.');
          resetTransaction();
        },
        onClose: () => {
          console.log('Payment dialog closed');
          showModal('Dialog Ditutup', `Transaksi dalam status pending. Order ID: ${orderId}`);
        },
      });
    }
  };

  const cancelTransaction = async () => {
    Modal.confirm({
      title: 'Konfirmasi Pembatalan',
      content: 'Anda yakin ingin membatalkan transaksi ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          const response = await axios.post('/api/cancelPayment', { orderId });
          if (response.status === 200) {
            setModalContent({ title: 'Pembatalan Berhasil', message: 'Transaksi berhasil dibatalkan.' });
            resetTransaction();
            setPaymentStatus(null); // Hapus status setelah dibatalkan
          } else {
            setModalContent({ title: 'Pembatalan Gagal', message: 'Gagal membatalkan transaksi di Midtrans.' });
          }
        } catch (error) {
          console.error('Error cancelling transaction:', error);
          setModalContent({ title: 'Pembatalan Gagal', message: 'Gagal membatalkan transaksi di Midtrans.' });
        }
        setIsModalVisible(true); // Menampilkan modal hasil
      },
    });
  };

  const resetTransaction = () => {
    setSnapToken(null);
    setOrderId(null);
    setIsProcessing(false);
  };

  const getPrice = (category: string, option: string) => {
    if (category === 'Reguler') {
      switch (option) {
        case 'EarlyBird 1':
          return 10;
        case 'EarlyBird 2':
          return 800000;
        case 'Regular':
          return 1200000;
        default:
          return 0;
      }
    }
    return 0;
  };

  return (
    <div className="confirmation-container">
      <Modal 
        title={modalContent.title} 
        visible={isModalVisible} 
        onOk={handleModalClose} 
      >
        <p>{modalContent.message}</p>
      </Modal>

      {paymentSuccess ? (
        <PaymentSuccess orderId={orderId!} fullName={formData.fullName} onNext={onNext} />
      ) : (
        <Card title="Step 3: Konfirmasi" className="registration-card">
          <div className="confirmation-data">
            <div>Nama Lengkap: {formData.fullName}</div>
            <div>Email Aktif: {formData.email}</div>
            <div>Tanggal Lahir: {formData.birthDate}</div>
            <div>No. Telepon: {formData.phone}</div>
            <div>Sumber Informasi: {formData.infoSource}</div>
            <div>Provinsi: {formData.province}</div>
            <div>Kabupaten: {formData.regency}</div>
            <div>Kecamatan: {formData.district}</div>
            <div>Desa: {formData.village}</div>
            <div>Alamat: {formData.address}</div>
            <div>Alasan: {formData.reason}</div>
            <div>Jalur Pendaftaran: {formData.category}</div>
            <div>Opsi: {formData.option}</div>
            <div>Harga: Rp. {getPrice(formData.category, formData.option)}</div>
          </div>
          <div style={{ marginTop: '16px' }}>
            {!isProcessing && !snapToken && (
              <Button type="default" onClick={onBack} style={{ marginRight: '8px' }}>
                Kembali
              </Button>
            )}
            {!isProcessing && !snapToken ? (
              <Button type="primary" onClick={handlePayment}>
                Bayar
              </Button>
            ) : (
              <div>
                <Button type="default" onClick={continuePayment}>
                  Status Transaksi
                </Button>
                <Button type="primary" onClick={cancelTransaction} style={{ marginLeft: '8px' }}>
                  Batalkan Transaksi
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistrationConfirmation;
