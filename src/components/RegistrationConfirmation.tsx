import { Card, Button, Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PaymentSuccess from './PaymentSuccess';

const generateOrderId = () => `${Math.floor(1000 + Math.random() * 9000)}`;

export const RegistrationConfirmation = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => {
  const formData = useSelector((state: RootState) => state.form);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem('orderId');
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
  }, []);

  const handlePayment = async () => {
    if (isProcessing) {
      message.info('Pembayaran sedang diproses. Silakan tunggu.');
      return;
    }
    setIsProcessing(true);

    if (orderId) {
      sessionStorage.removeItem('orderId');
      setOrderId(null);
    }

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    sessionStorage.setItem('orderId', newOrderId);

    try {
      const response = await axios.post('/api/payment', {
        amount: parseInt(formData.price.replace(/[Rp\s.]/g, ''), 10),
        orderId: newOrderId,
        customerDetails: {
          first_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.regency,
          country_code: 'IDN',
        },
        formData,
      });

      if (response.data && response.data.qrCodeUrl) {
        setQrCodeUrl(response.data.qrCodeUrl);
        setIsPaymentModalVisible(true);
      }
    } catch (error) {
      console.error('Error occurred while initiating payment:', error);
      message.error('Gagal memulai transaksi pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkTransaction = async () => {
    try {
      const response = await axios.get(`/api/payment?orderId=${orderId}`);
      const status = response.data.transaction_status;

      if (status === 'settlement') {
        setPaymentSuccess(true);
        setIsPaymentModalVisible(false);

        try {
          await axios.post('/api/saveData', {
            orderId,
            formData,
          });
          message.success('Data berhasil disimpan!');
        } catch (error) {
          console.error('Error saving registration data:', error);
          message.error('Gagal menyimpan data.');
        }

        sessionStorage.removeItem('orderId');
        setOrderId(null);
      } else {
        message.info('Pembayaran belum berhasil.');
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      message.error('Gagal memeriksa status transaksi.');
    }
  };

  const cancelTransaction = async () => {
    if (!orderId) {
      message.error('Order ID tidak ditemukan.');
      return;
    }

    try {
      const statusResponse = await axios.get(`/api/payment?orderId=${orderId}`);
      const status = statusResponse.data.transaction_status;

      if (status === 'pending' || status === 'authorized') {
        const cancelResponse = await axios.delete('/api/payment', { data: { orderId } });

        if (cancelResponse.data.cancelResponse) {
          setIsPaymentModalVisible(false);
          sessionStorage.removeItem('orderId');
          setOrderId(null);
          message.info('Transaksi dibatalkan. Anda bisa melakukan transaksi baru.');
        } else {
          message.error('Gagal membatalkan transaksi.');
        }
      } else {
        message.info('Status transaksi tidak memungkinkan untuk dibatalkan.');
      }
    } catch (error) {
      console.error('Error while canceling the transaction:', error);
      message.error('Gagal membatalkan transaksi.');
    }
  };

  return (
    <div className="confirmation-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        title="Konfirmasi Pembayaran"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="cancel" type="default" danger onClick={cancelTransaction} loading={isProcessing}>
            Batalkan Transaksi
          </Button>,
          <Button key="check" type="primary" onClick={checkTransaction}>
            Cek Transaksi
          </Button>
        ]}
      >
        <p>Order ID: {orderId}</p>
        <p>Total Pembayaran: {formData.price}</p>

        {qrCodeUrl && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <h4>Scan untuk membayar dengan QRIS:</h4>
            <img src={qrCodeUrl} alt="QR Code Pembayaran" style={{ width: '256px', height: '256px' }} />
          </div>
        )}
      </Modal>

      {paymentSuccess ? (
        <PaymentSuccess orderId={orderId!} fullName={formData.fullName} onNext={onNext} />
      ) : (
        <Card title="Konfirmasi Pendaftaran" className="confirmation-card">
          <div className="confirmation-data" style={{ display: 'flex', flexDirection: 'column', padding: '25px', border: '5px solid grey', borderRadius: '20px' }}>
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
            <div>Opsi: {formData.option}</div>
            <div>Harga: Rp. {formData.price}</div>
          </div>

          <div className="button-container" style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
            <Button onClick={onBack}>Kembali</Button>
            <Button type="primary" onClick={handlePayment} loading={isProcessing}>
              Lanjut ke Pembayaran
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistrationConfirmation;
