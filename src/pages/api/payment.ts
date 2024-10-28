// src/pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, orderId, customerDetails, formData } = req.body; // Ambil formData dari req.body

    // Gabungkan alamat
    const fullAddress = `${formData.address}, ${formData.village}, ${formData.district}, ${formData.regency}, ${formData.province}`;

    // Tentukan item_details berdasarkan kategori dan opsi
    const itemDetails = getItemDetails(formData.category, formData.option);

    const requestBody = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerDetails.first_name,
        last_name: customerDetails.last_name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        billing_address: {
          first_name: customerDetails.first_name,
          last_name: customerDetails.last_name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: fullAddress, // Menggunakan alamat yang digabungkan
          city: formData.regency, // Menggunakan kabupaten sebagai kota
          postal_code: "-", // Ganti dengan kode pos yang sesuai
          country_code: "IDN", // Kode negara Indonesia
        },
        shipping_address: {
          first_name: customerDetails.first_name,
          last_name: customerDetails.last_name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: fullAddress, // Menggunakan alamat yang digabungkan
          city: formData.regency, // Menggunakan kabupaten sebagai kota
          postal_code: "-", // Ganti dengan kode pos yang sesuai
          country_code: "IDN", // Kode negara Indonesia
        },
      },
      item_details: itemDetails, // Menambahkan item_details
    };

    try {
      const response = await axios({
        url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_SERVER_KEY}:`).toString('base64'),
        },
        data: requestBody,
      });

      const snapToken = response.data.token;
      console.log("Retrieved snap token:", snapToken);
      res.status(200).json({ status: "ok", token: snapToken });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to call API:", error.response?.data);
        res.status(500).json({ message: "Gagal membuat transaksi", error: error.response?.data });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Terjadi kesalahan tidak terduga" });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Fungsi untuk mendapatkan item_details berdasarkan kategori dan opsi
function getItemDetails(category: string, option: string) {
  const items = [];

  if (category === 'Reguler') {
    switch (option) {
      case 'EarlyBird 1':
        items.push({
          id: 'earlyBird1',
          price: 10,
          quantity: 1,
          name: 'Early Bird 1',
        });
        break;
      case 'EarlyBird 2':
        items.push({
          id: 'earlyBird2',
          price: 800000,
          quantity: 1,
          name: 'Early Bird 2',
        });
        break;
      case 'Regular':
        items.push({
          id: 'regular',
          price: 1200000,
          quantity: 1,
          name: 'Regular',
        });
        break;
      default:
        break;
    }
  } else if (category === 'Fast Track') {
    // Tambahkan item untuk Fast Track jika diperlukan
    items.push({
      id: 'fastTrack',
      price: 1500000, // Misalkan harga untuk Fast Track
      quantity: 1,
      name: 'Fast Track',
    });
  }

  return items;
}
