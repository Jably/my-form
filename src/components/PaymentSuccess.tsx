// src/components/PaymentSuccess.tsx
'use client';
import { Card } from 'antd';

interface PaymentSuccessProps {
  orderId: string;
  fullName: string;
  onNext: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ orderId, fullName, onNext }) => {
  return (
    <div className="payment-success-container">
      <Card title="Pembayaran Berhasil" className="payment-success-card">
        <div>Order ID: {orderId}</div>
        <div>Nama: {fullName}</div>
        <div>Note: Simpan Order ID untuk mengisi submission nanti.</div>
        <button onClick={onNext}>Lanjutkan</button>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
