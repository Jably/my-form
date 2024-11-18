"use client";
import { useState, useEffect } from "react";
import { RegistrationStep1 } from "./RegistrationStep1";
import { RegistrationStep2 } from "./RegistrationStep2";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { Card } from "antd";

export const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false); // Untuk menandai apakah ini sudah di-render di sisi klien

  // Mengambil langkah saat ini dari localStorage ketika komponen di-render pada sisi klien
  useEffect(() => {
    setIsClient(true); // Menandakan bahwa komponen sudah dirender di sisi klien
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedStep = localStorage.getItem("currentStep");
      if (savedStep && !isNaN(Number(savedStep))) {
        setCurrentStep(Number(savedStep)); // Mengambil langkah yang disimpan
      }
    }
  }, [isClient]); // Pastikan hanya dijalankan setelah komponen di-render di klien

  // Update localStorage setiap kali currentStep berubah
  useEffect(() => {
    if (isClient && currentStep >= 1 && currentStep <= 3) {
      // Pastikan currentStep dalam range yang benar
      localStorage.setItem("currentStep", currentStep.toString());
    }
  }, [currentStep, isClient]);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div className="registration-container">
      <div className="title">
        <p>
          Empower U: Youth Summit Across 3 European Countries - The Netherlands,
          Belgium, and France
        </p>
      </div>
      <div className="steps-container">
        <div className="steps-wrapper">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`step ${currentStep === step ? "active" : ""}`}
            >
              <div className="step-title">{`Step ${step}: ${
                step === 1
                  ? "Personal Information"
                  : step === 2
                  ? "Select Registration Path"
                  : "Confirmation"
              }`}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: currentStep >= step ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        {currentStep === 1 && <RegistrationStep1 onNext={nextStep} />}
        {currentStep === 2 && (
          <RegistrationStep2 onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <RegistrationConfirmation onNext={nextStep} onBack={prevStep} />
        )}
      </Card>
    </div>
  );
};
