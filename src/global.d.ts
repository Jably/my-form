// src/global.d.ts

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

// Tambahkan deklarasi untuk 'qrcode.react' di sini
declare module 'qrcode.react' {
  const QRCode: any;
  export default QRCode;
}


export {};
