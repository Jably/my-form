// /api/cancelPayment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId } = req.body;

    try {
      const response = await axios.post(
        `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(process.env.SERVER_KEY + ':').toString('base64')}`,
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      return res.status(500).json({ message: 'Gagal membatalkan transaksi di Midtrans' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
