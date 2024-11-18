// src/components/PaymentSuccess.tsx
'use client';
import { Card, Button, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';

interface PaymentSuccessProps {
  orderId: string;
  fullName: string;
  checkoutDate: string;
  totalPaid: string;
  email: string;
  onNext: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ orderId, fullName, email, checkoutDate, totalPaid, onNext }) => {

  const [isEmailSent, setIsEmailSent] = useState(false); // State untuk melacak pengiriman email
  const isSendingRef = useRef(false); // Ref untuk memastikan pengiriman hanya sekali

  const handleDownloadImage = async (format: 'png') => {
    const element = document.getElementById('payment-success');
    if (element) {
      const canvas = await html2canvas(element);
      const dataURL = canvas.toDataURL(`image/${format}`);

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `Receipt_${orderId}.${format}`;
      link.click();
    }
  };

  const sendEmailReceipt = async () => {
    if (isSendingRef.current || isEmailSent) return; // Hentikan jika email sudah dikirim atau sedang dalam proses

    isSendingRef.current = true;
    const element = document.getElementById('payment-success');
    if (element) {
      try {
        const canvas = await html2canvas(element);
        const imageData = canvas.toDataURL('image/png');

        const response = await fetch('/api/sendReceipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            orderId,
            fullName,
            checkoutDate,
            totalPaid,
            imageData,
          }),
        });

        if (response.ok) {
          message.success('Receipt telah dikirim ke email Anda.');
          setIsEmailSent(true);
        } else {
          message.error('Gagal mengirim receipt ke email.');
        }
      } catch (error) {
        console.error('Error sending email receipt:', error);
        message.error('Gagal mengirim receipt ke email.');
      } finally {
        isSendingRef.current = false;
      }
    }
  };

  const handleOnNext = () => {
    // Clear storage
    localStorage.removeItem('registrationStep1Data');
    localStorage.removeItem('registrationStep2Data');
    sessionStorage.removeItem('orderId');
    
    // Redirect to URL
    window.location.href = 'https://riselab.id';
  };

  useEffect(() => {
    console.log('PaymentSuccess mounted');
    // Kirim email secara otomatis saat komponen dimuat
    sendEmailReceipt();
  }, []); // Hanya dipanggil sekali saat komponen pertama kali dimount

  return (
    <div className="payment-success-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Card title="Payment Successfully Received!" className="payment-success-card" id="payment-success">
        <CheckCircleOutlined style={{ fontSize: '64px', color: 'green', marginBottom: '20px' }} />
        <div><strong>Transaction ID:</strong> {orderId}</div>
        <div><strong>Name:</strong> {fullName}</div>
        <div><strong>Checkout Date:</strong> {checkoutDate}</div>
        <div><strong>Total Amount Paid:</strong> {totalPaid}</div>
        <div><strong>Note:</strong> Please Save Your Transaction ID!</div>
        <div><p>Transaction ID will be used as proof of payment and required when submitting your opinion in the next phase. We will also send this transaction ID to the email you registered.</p></div>
      </Card>
      
      <Button type="primary" onClick={() => handleDownloadImage('png')} style={{ marginTop: '20px' }}>
        Download as PNG
      </Button>
      <Button onClick={handleOnNext} style={{ marginTop: '10px' }}>Finish</Button>
    </div>
  );
};

export default PaymentSuccess;
