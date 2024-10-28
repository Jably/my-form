// src/app/page.tsx
'use client';

import { RegistrationForm } from '@/components/RegistrationForm';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // Dynamically add Midtrans script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PRIVATE_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <RegistrationForm />
    </div>
  );
}