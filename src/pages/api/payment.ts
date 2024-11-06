import type { NextApiRequest, NextApiResponse } from 'next';
const { MidtransClient } = require('midtrans-node-client');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, orderId, customerDetails, formData } = req.body;
    const fullAddress = `${formData.address}, ${formData.village}, ${formData.district}, ${formData.regency}, ${formData.province}`;

    const core = new MidtransClient.CoreApi({
      isProduction: false, 
      serverKey: Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_SERVER_KEY}:`),
      clientKey:Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_CLIENT_KEY}:`),
    });

    try {
      const chargeResponse = await core.charge({
        payment_type: 'gopay', 
        transaction_details: {
          order_id: orderId, 
          gross_amount: amount,
        },
        item_details: [
          {
            id: 'item1',
            name: `${formData.category} ${formData.option}`,
            quantity: 1,
            price: amount,
          },
        ],
        customer_details: {
          first_name: customerDetails.first_name,
          last_name: customerDetails.last_name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          billing_address: {
            address: fullAddress,
            city: formData.regency,
            postal_code: '-',
            country_code: 'IDN',
          },
        },
        gopay: {
          enable_callback: true,
          callback_url: 'someapps://callback',
        },
      });

      if (chargeResponse && chargeResponse.actions) {
        const qrisAction = chargeResponse.actions.find(
          (action: { name: string }) => action.name === 'generate-qr-code' || action.name === 'qris'
        );

        if (qrisAction) {
          res.status(200).json({ qrCodeUrl: qrisAction.url });
        } else {
          res.status(500).json({ message: 'QR Code tidak ditemukan dalam response.' });
        }
      } else {
        res.status(500).json({ message: 'Tidak ada tindakan yang valid dalam response transaksi.' });
      }
    } catch (error: any) {
      console.error('Error occurred while processing the payment:', error);
      res.status(500).json({ message: 'Gagal membuat transaksi', error: error.message || 'Terjadi kesalahan tidak terduga' });
    }
  } else if (req.method === 'GET') {
    const { orderId } = req.query;

    const core = new MidtransClient.CoreApi({
      isProduction: false,
      serverKey: Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_SERVER_KEY}:`),
      clientKey:Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_CLIENT_KEY}:`),
    });

    try {
      const transactionStatus = await core.transaction.status(orderId as string);
      res.status(200).json(transactionStatus);
    } catch (error: any) {
      console.error('Error occurred while checking transaction status:', error);
      res.status(500).json({ message: 'Gagal memeriksa status transaksi', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { orderId } = req.body;
    const core = new MidtransClient.CoreApi({
      isProduction: false,
      serverKey: Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_SERVER_KEY}:`),
      clientKey:Buffer.from(`${process.env.NEXT_PRIVATE_MIDTRANS_CLIENT_KEY}:`),
    });

    try {
      const cancelResponse = await core.transaction.cancel(orderId as string);
      res.status(200).json({ cancelResponse });
    } catch (error: any) {
      console.error('Error while canceling the transaction:', error);
      res.status(500).json({ message: 'Gagal membatalkan transaksi', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
