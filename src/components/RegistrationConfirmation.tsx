// src/components/RegistrationConfirmation.tsx
"use client";
import { useEffect, useState } from "react";
import { Modal, Button, message, Card } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import PaymentSuccess from "./PaymentSuccess";

const generateOrderId = () => `${Math.floor(1000 + Math.random() * 9000)}`;

export const RegistrationConfirmation = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const formData = useSelector((state: RootState) => state.form);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [savedFormData, setSavedFormData] = useState<any>(null);
  const [checkoutDate, setCheckoutDate] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data dari localStorage
    const step1Data = localStorage.getItem("registrationStep1Data");
    const step2Data = localStorage.getItem("registrationStep2Data");

    if (step1Data && step2Data) {
      setSavedFormData({
        ...JSON.parse(step1Data),
        ...JSON.parse(step2Data),
      });
    }
  }, []);

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("orderId");
    const storedStatus = sessionStorage.getItem("paymentStatus");
    const storedQrCode = sessionStorage.getItem("qrCodeUrl");

    if (storedOrderId && storedStatus === "pending") {
      setOrderId(storedOrderId);
      setQrCodeUrl(storedQrCode);
      setIsPaymentModalVisible(true);
    }
  }, []);

  const handlePayment = async () => {
    if (isProcessing) {
      message.info("Pembayaran sedang diproses. Silakan tunggu.");
      return;
    }
    setIsProcessing(true);

    if (orderId) {
      sessionStorage.removeItem("orderId");
      setOrderId(null);
    }

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    sessionStorage.setItem("orderId", newOrderId);
    sessionStorage.setItem("paymentStatus", "pending");

    try {
      const response = await axios.post("/api/payment", {
        amount: parseInt(savedFormData?.price.replace(/[Rp\s.]/g, ""), 10),
        orderId: newOrderId,
        customerDetails: {
          first_name: savedFormData?.fullName,
          email: savedFormData?.email,
          phone: savedFormData?.phone,
          address: savedFormData?.address,
          city: savedFormData?.regency,
          country_code: "IDN",
        },
        savedFormData,
      });

      if (response.data && response.data.qrCodeUrl) {
        const qrCode = response.data.qrCodeUrl;
        setQrCodeUrl(qrCode);
        sessionStorage.setItem("qrCodeUrl", qrCode);
        setIsPaymentModalVisible(true);
      }
    } catch (error) {
      console.error("Error occurred while initiating payment:", error);
      message.error("Gagal memulai transaksi pembayaran. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkTransaction = async () => {
    try {
      const response = await axios.get(`/api/payment?orderId=${orderId}`);
      const status = response.data.transaction_status;

      if (status === "settlement") {
        setPaymentSuccess(true);
        setIsPaymentModalVisible(false);

        const currentDate = new Date().toLocaleDateString();
        setCheckoutDate(currentDate); // Set checkoutDate saat transaksi berhasil

        try {
          await axios.post("/api/saveData", {
            orderId,
            savedFormData,
          });
          message.success("Data berhasil disimpan!");
        } catch (error) {
          console.error("Error saving registration data:", error);
          message.error("Gagal menyimpan data.");
        }

        sessionStorage.removeItem("paymentStatus");
        sessionStorage.removeItem("qrCodeUrl");
        localStorage.removeItem("currentStep");
      } else if (status === "pending") {
        message.info(
          "Pembayaran masih dalam proses. Silakan scan QR Code lagi."
        );
        setQrCodeUrl(sessionStorage.getItem("qrCodeUrl"));
        setIsPaymentModalVisible(true);
      } else {
        message.info("Pembayaran belum berhasil.");
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      message.error("Gagal memeriksa status transaksi.");
    }
  };

  const cancelTransaction = async () => {
    if (!orderId) {
      message.error("Order ID tidak ditemukan.");
      return;
    }

    try {
      const statusResponse = await axios.get(`/api/payment?orderId=${orderId}`);
      const status = statusResponse.data.transaction_status;

      if (status === "pending" || status === "authorized") {
        const cancelResponse = await axios.delete("/api/payment", {
          data: { orderId },
        });

        if (cancelResponse.data.cancelResponse) {
          setIsPaymentModalVisible(false);
          sessionStorage.removeItem("orderId");
          sessionStorage.removeItem("paymentStatus");
          setOrderId(null);
          sessionStorage.removeItem("qrCodeUrl"); // Hapus QR Code dari sessionStorage
          message.info(
            "Transaksi dibatalkan. Anda bisa melakukan transaksi baru."
          );
        } else {
          message.error("Gagal membatalkan transaksi.");
        }
      } else {
        message.info("Status transaksi tidak memungkinkan untuk dibatalkan.");
      }
    } catch (error) {
      console.error("Error while canceling the transaction:", error);
      message.error("Gagal membatalkan transaksi.");
    }
  };

  return (
    <div className="confirmation-container">
      <Modal
        title="Konfirmasi Pembayaran"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        closable={false}
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            type="default"
            danger
            onClick={() => cancelTransaction()}
            loading={isProcessing}
          >
            Batalkan Transaksi
          </Button>,
          <Button key="check" type="primary" onClick={() => checkTransaction()}>
            Cek Transaksi
          </Button>,
        ]}
      >
        <p>Order ID: {orderId}</p>
        <p>Total Pembayaran: {savedFormData?.price}</p>

        {qrCodeUrl && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <h4>Scan untuk membayar dengan QRIS:</h4>
            <img
              src={qrCodeUrl}
              alt="QR Code Pembayaran"
              style={{ width: "256px", height: "256px" }}
            />
          </div>
        )}
      </Modal>

      {paymentSuccess ? (
        <PaymentSuccess
          orderId={orderId!}
          fullName={savedFormData?.fullName}
          totalPaid={savedFormData?.price}
          checkoutDate={checkoutDate!} // Hanya menampilkan checkoutDate saat pembayaran berhasil
          email={savedFormData?.email!}
          onNext={onNext}
        />
      ) : (
        <Card title="" className="confirmation-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="circle">3</div>
            <div className="text">Confirmation</div>
          </div>
          <div
            className="confirmation-data"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "35px",
              border: "5px #cecece",
              borderRadius: "20px",
              marginTop: "20px",
              fontSize: "18px",
              lineHeight: "30px",
            }}
          >
            <div>
              <strong>Full Name:</strong> {savedFormData?.fullName}
            </div>
            <div>
              <strong>Email:</strong> {savedFormData?.email}
            </div>
            <div>
              <strong>Birthdate:</strong> {savedFormData?.birthDate}
            </div>
            <div>
              <strong>WhatsApp Number:</strong> {savedFormData?.phone}
            </div>
            <div>
              <strong>Source Of Info:</strong> {savedFormData?.infoSource}
            </div>
            <div>
              <strong>Province:</strong> {savedFormData?.province}
            </div>
            <div>
              <strong>Regency:</strong> {savedFormData?.regency}
            </div>
            <div>
              <strong>District:</strong> {savedFormData?.district}
            </div>
            <div>
              <strong>Village:</strong> {savedFormData?.village}
            </div>
            <div>
              <strong>Address:</strong> {savedFormData?.address}
            </div>
            <div>
              <strong>Registration Path:</strong> {savedFormData?.option}
            </div>
            <div>
              <strong>Price:</strong> {savedFormData?.price}
            </div>
          </div>

          <div
            className="button-container"
            style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={onBack}>Previous</Button>
            <Button
              type="primary"
              onClick={handlePayment}
              loading={isProcessing}
            >
              Proceed To Payment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistrationConfirmation;
