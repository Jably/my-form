// // src/pages/api/sendReceipt.ts
// import nodemailer from 'nodemailer';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { email, orderId, fullName, checkoutDate, totalPaid, imageData } = req.body;

//     console.log(`Sending receipt for Order ID: ${orderId} to email: ${email}`);

//     // Konfigurasi transporter Nodemailer
//     const transporter = nodemailer.createTransport({
//       host: process.env.NEXT_PRIVATE_HOST, // Ganti dengan SMTP server dari Niagahoster
//       port: Number(process.env.NEXT_PRIVATE_EMAIL_PORT), // Port yang digunakan oleh SMTP server
//       secure: true, // Gunakan true untuk port 465, false untuk port lainnya
//       auth: {
//         user: process.env.NEXT_PRIVATE_HOST_EMAIL, // Ganti dengan email Anda
//         pass: process.env.NEXT_PRIVATE_HOST_PASS, // Ganti dengan password email Anda
//       },
//     });

//     // Konfigurasi email
//     const mailOptions = {
//       from: process.env.NEXT_PRIVATE_HOST_EMAIL,
//       to: email,
//       subject: 'Payment Successfully Received!',
//       text: `Thank you ${fullName},\n\nfor registering for EmpowerU Youth Summit to the Netherlands, Belgium, and Paris. We have received your payment.\n\nPlease Save Your Transaction ID!: ${orderId}\nCheckout Date: ${checkoutDate}\nTotal Paid: ${totalPaid}\n\nTransaction ID will be used as proof of payment and required when submitting your opinion in the next phase.\n\n Welcome aboard, and see you at EmpowerU Youth Summit!`,
//       attachments: [
//         {
//           filename: `Receipt_${orderId}.png`,
//           content: imageData.split('base64,')[1],
//           encoding: 'base64',
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log(`Email successfully sent to ${email} for Order ID: ${orderId}`);
//       res.status(200).json({ message: 'Email berhasil dikirim' });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       res.status(500).json({ message: 'Gagal mengirim email' });
//     }
//   } else {
//     res.status(405).json({ message: 'Metode tidak diizinkan' });
//   }
// }