// src/components/RegistrationStep2.tsx
'use client';
import { Form, Radio, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateForm } from '@/store/formSlice';
import React, { useState } from 'react';

interface RegistrationStep2Props {
  onNext: () => void;
  onBack: () => void; // Tambahkan props onBack
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [price, setPrice] = useState('');

  const handlePathChange = (e: any) => {
    const value = e.target.value;
    setSelectedPath(value);
    setSelectedOption('');
    setPrice('');
  };

  const handleOptionChange = (e: any) => {
    const value = e.target.value;
    setSelectedOption(value);
    
    // Set price based on selection
    if (selectedPath === 'Reguler') {
      switch (value) {
        case 'EarlyBird 1':
          setPrice('Rp 10');
          break;
        case 'EarlyBird 2':
          setPrice('Rp 800.000');
          break;
        case 'Regular':
          setPrice('Rp 1.200.000');
          break;
        default:
          setPrice('');
      }
    }
  };

  const onFinish = () => {
    // Update Redux store with selected path and option
    dispatch(updateForm({ category: selectedPath, option: selectedOption }));
    onNext(); // Panggil fungsi untuk melanjutkan ke langkah berikutnya
  };

  return (
    <div className="step2-container">
      <Card title="Step 2: Pilih Jalur Pendaftaran" className="registration-card">
        <div className="step2-description">
          Silahkan pilih jalur pendaftaran sesuai dengan preferensi-mu.
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onFinish(); }}>
          <div className="registration-path">
            <Radio.Group onChange={handlePathChange} value={selectedPath}>
              
              <Radio value="Reguler">Reguler</Radio>
              <Radio value="Fast Track">Fast Track</Radio>
            </Radio.Group>
          </div>

          {selectedPath === 'Reguler' && (
            <div className="reguler-options">
              <Radio.Group onChange={handleOptionChange} value={selectedOption}>
                <Radio value="EarlyBird 1">EarlyBird 1</Radio>
                <Radio value="EarlyBird 2">EarlyBird 2</Radio>
                <Radio value="Regular">Regular</Radio>
              </Radio.Group>
              <div className="price-display">
                {selectedOption && <div>Harga: {price}</div>}
              </div>
            </div>
          )}

          <div className="button-group">
            <Button type="default" onClick={onBack} className="back-button" style={{ marginRight: '8px' }}>
              Kembali
            </Button>
            <Button type="primary" htmlType="submit" className="submit-button" disabled={!selectedPath}>
              Selanjutnya
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
