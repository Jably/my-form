// pages/api/registration.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

interface savedFormData {
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
  option: string;   
  price: string;    
  email: string;
}

const saveRegistrationData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { orderId, savedFormData }: { orderId: string; savedFormData: savedFormData } = req.body;

    // Check if formData is defined
    if (!savedFormData) {
      return res.status(400).json({ message: 'formData is required' });
    }

    // Gabungkan province, regency, district, dan village ke dalam satu string fullAddress
    const fullAddress = `${savedFormData.address || 'Alamat tidak tersedia'}, ${savedFormData.village}, ${savedFormData.district}, ${savedFormData.regency}, ${savedFormData.province}`;
    console.log('Data form yang diterima:', savedFormData);
    console.log('Full Address:', fullAddress);

    try {
      const result = await prisma.registration.create({
        data: {
          orderId: orderId,
          fullName: savedFormData.fullName,
          email: savedFormData.email,
          phone: savedFormData.phone,
          address: fullAddress,
          option: savedFormData.option,
          price: savedFormData.price,
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
