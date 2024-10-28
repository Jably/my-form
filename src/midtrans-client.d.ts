// src/@types/midtrans-client.d.ts
declare module 'midtrans-client' {
  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameter: any): Promise<any>;
  }
}
