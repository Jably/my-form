import type { NextApiRequest, NextApiResponse } from 'next';
const { MidtransClient } = require('midtrans-node-client');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Memastikan bahwa request menggunakan metode GET
  if (req.method === 'GET') {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const core = new MidtransClient.CoreApi({
      isProduction: false,  // Tentukan apakah ini environment production atau sandbox
      serverKey: process.env.SERVER_KEY,
      clientKey: process.env.CLIENT_KEY,
    });

    try {
      // Memeriksa status transaksi berdasarkan orderId
      const statusResponse = await core.transaction.status(orderId as string);

      // Mengirimkan status transaksi kembali ke frontend
      return res.status(200).json(statusResponse);
    } catch (error: any) {
      console.error('Error occurred while checking the transaction status:', error);
      return res.status(500).json({ message: 'Gagal memeriksa status transaksi', error: error.message || 'Terjadi kesalahan tidak terduga' });
    }
  } else {
    // Jika metode selain GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
