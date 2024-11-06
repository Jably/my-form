// src/components/RegistrationStep2.tsx
import { Button, Card, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateForm } from '@/store/formSlice';
import React, { useState } from 'react';
import '../app/globals.css';

interface RegistrationStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [selectedOption, setSelectedOption] = useState('');
  const [price, setPrice] = useState('');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);

    const prices: { [key: string]: string } = {
      'EarlyBird 1': 'Rp 100.000',
      'EarlyBird 2': 'Rp 125.000',
      'Regular': 'Rp 150.000',
      'Fast Track': 'Rp 200.000',
    };

    setPrice(prices[option] || '');
  };

  const onFinish = () => {
    dispatch(updateForm({ option: selectedOption, price })); // Menyimpan data option dan price ke Redux
    onNext(); // Pindah ke langkah berikutnya
  };

  return (
    <Card title="Step 2: Pilih Jalur Pendaftaran" className="registration-card">
      <div className="step2-description">
        Silahkan pilih opsi pendaftaran sesuai dengan preferensi-mu.
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onFinish(); }} className="registration-form">
        <div className="registration-path" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <Card
            className={`option-card ${selectedOption === 'Fast Track' ? 'selected' : ''}`}
            title={
              <div className={'ant-card-title2'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio
                  checked={selectedOption === 'Fast Track'}
                  onChange={() => handleOptionChange('Fast Track')}
                />
                <span>Fast Track Registration</span>
              </div>
            }
            style={{ flex: '1 1 calc(50% - 16px)' }}
            onClick={() => handleOptionChange('Fast Track')}
          >
            <div className="regist-info">
              <p>Registration: 1-31 November 2024</p>
              <p>Last Submission: <span role="img" aria-label="calendar">📅</span> 30 November 2024</p>
              <p>Do not need to do administrative selection process</p>
              <p>Free Exclusive Webinar: Persiapan Memperoleh Beasiswa Studi Ke Luar Negeri</p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 200.000
            </div>
          </Card>

          <Card
            className={`option-card ${selectedOption === 'EarlyBird 1' ? 'selected' : ''}`}
            title={
              <div className={'ant-card-title2'} style={{ display: 'flex', alignItems: 'center' }}>
                <Radio
                  checked={selectedOption === 'EarlyBird 1'}
                  onChange={() => handleOptionChange('EarlyBird 1')}
                />
                <span>EarlyBird 1</span>
              </div>
            }
            style={{ flex: '1 1 calc(50% - 16px)' }}
            onClick={() => handleOptionChange('EarlyBird 1')}
          >
            <div className="regist-info">
              <p>Registration: 1-31 November 2024</p>
              <p>Last Submission: <span role="img" aria-label="calendar">📅</span> 30 November 2024</p>
              <p>Do not need to do administrative selection process</p>
              <p>Free Exclusive Webinar: Persiapan Memperoleh Beasiswa Studi Ke Luar Negeri</p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 100.000
            </div>
          </Card>

          <Card
            className={`option-card ${selectedOption === 'EarlyBird 2' ? 'selected' : ''}`}
            title={
              <div className={'ant-card-title2'} style={{ display: 'flex', alignItems: 'center' }}>
                <Radio
                  checked={selectedOption === 'EarlyBird 2'}
                  onChange={() => handleOptionChange('EarlyBird 2')}
                />
                <span>EarlyBird 2</span>
              </div>
            }
            style={{ flex: '1 1 calc(50% - 16px)' }}
            onClick={() => handleOptionChange('EarlyBird 2')}
          >
            <div className="regist-info">
              <p>Registration: 1-31 November 2024</p>
              <p>Last Submission: <span role="img" aria-label="calendar">📅</span> 30 November 2024</p>
              <p>Do not need to do administrative selection process</p>
              <p>Free Exclusive Webinar: Persiapan Memperoleh Beasiswa Studi Ke Luar Negeri</p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 125.000
            </div>
          </Card>

          <Card
            className={`option-card ${selectedOption === 'Regular' ? 'selected' : ''}`}
            title={
              <div className={'ant-card-title2'} style={{ display: 'flex', alignItems: 'center' }}>
                <Radio
                  checked={selectedOption === 'Regular'}
                  onChange={() => handleOptionChange('Regular')}
                />
                <span>Regular</span>
              </div>
            }
            style={{ flex: '1 1 calc(50% - 16px)' }}
            onClick={() => handleOptionChange('Regular')}
          >
            <div className="regist-info">
              <p>Registration: 1-31 November 2024</p>
              <p>Last Submission: <span role="img" aria-label="calendar">📅</span> 30 November 2024</p>
              <p>Do not need to do administrative selection process</p>
              <p>Free Exclusive Webinar: Persiapan Memperoleh Beasiswa Studi Ke Luar Negeri</p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 150.000
            </div>
          </Card>
        </div>

        <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap' }}>
          <Button onClick={onBack} className="back-button">
            Kembali
          </Button>
          <Button type="primary" htmlType="submit" className="submit-button" disabled={!selectedOption}>
            Selanjutnya
          </Button>
        </div>
      </form>
    </Card>
  );
};
