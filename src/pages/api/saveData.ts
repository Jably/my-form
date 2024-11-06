// pages/api/registration.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

interface FormData {
  fullName: string;
  birthDate: string | null;
  phone: string;
  infoSource: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  address: string;
  reason: string;
  category: string; // Jalur pendaftaran
  option: string;   // Opsi jalur pendaftaran
  price: string;    // Tambahkan properti price
  email: string;
}

const saveRegistrationData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { orderId, formData }: { orderId: string; formData: FormData } = req.body;

    // Gabungkan province, regency, district, dan village ke dalam satu string fullAddress
    const fullAddress = `${formData.address}, ${formData.village}, ${formData.district}, ${formData.regency}, ${formData.province}`;

    try {
      const result = await prisma.registration.create({
        data: {
          orderId: orderId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: fullAddress,
          price: formData.price,
          transactionStatus: 'settlement', // Status transaksi yang berhasil
        },
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error saving registration data:', error);
      res.status(500).json({ message: 'Error saving registration data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default saveRegistrationData;
