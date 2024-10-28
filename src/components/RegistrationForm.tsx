// src/components/RegistrationForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { RegistrationStep1 } from './RegistrationStep1';
import { RegistrationStep2 } from './RegistrationStep2';
import { RegistrationConfirmation } from './RegistrationConfirmation';
import { Card } from 'antd';

export const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Mengambil langkah saat ini dari localStorage ketika komponen di-render pada sisi klien
  useEffect(() => {
    const savedStep = typeof window !== 'undefined' ? localStorage.getItem('currentStep') : null;
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

  // Update localStorage setiap kali currentStep berubah, hanya jika di sisi klien
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentStep', currentStep.toString());
    }
  }, [currentStep]);

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  return (
    <div className="registration-container">
      <div className="steps-container">
        <div className="steps-wrapper">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`step ${currentStep === step ? 'active' : ''}`}>
              <div className="step-title">{`Step ${step}: ${
                step === 1 ? 'Isi Biodata' : step === 2 ? 'Pilih Jalur Pendaftaran' : 'Konfirmasi'
              }`}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: currentStep >= step ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        {currentStep === 1 && <RegistrationStep1 onNext={nextStep} />}
        {currentStep === 2 && <RegistrationStep2 onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <RegistrationConfirmation onNext={nextStep} onBack={prevStep} />}
      </Card>
    </div>
  );
};
