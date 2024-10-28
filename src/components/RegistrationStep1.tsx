// src/components/RegistrationStep1.tsx
'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, DatePicker, Select, Button, Card } from 'antd';
import { RootState } from '@/store/store';
import { updateForm } from '@/store/formSlice';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs'; // Impor dayjs
import { fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages } from '@/utils/api';

const { TextArea } = Input;
const { Option } = Select;

// Define types for provinces, regencies, districts, and villages
type Province = {
  id: string;
  name: string;
};

type Regency = {
  id: string;
  name: string;
};

type District = {
  id: string;
  name: string;
};

type Village = {
  id: string;
  name: string;
};

interface RegistrationStep1Props {
  onNext: () => void; // Callback for next step
}

export const RegistrationStep1 = ({ onNext }: RegistrationStep1Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [form] = Form.useForm();

  // Add states for data fetching
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  useEffect(() => {
    async function loadProvinces() {
      const data = await fetchProvinces();
      setProvinces(data);
    }
    loadProvinces();
  }, []);

  const handleProvinceChange = async (value: string) => {
    const selectedProvince = provinces.find(prov => prov.id === value);
    form.setFieldsValue({ regency: undefined, district: undefined, village: undefined });
    const data = await fetchRegencies(value);
    setRegencies(data);
    setDistricts([]);
    setVillages([]);
    dispatch(updateForm({ province: selectedProvince?.name || '', regency: '', district: '', village: '' }));
  };

  const handleRegencyChange = async (value: string) => {
    const selectedRegency = regencies.find(reg => reg.id === value);
    form.setFieldsValue({ district: undefined, village: undefined });
    const data = await fetchDistricts(value);
    setDistricts(data);
    setVillages([]);
    dispatch(updateForm({ regency: selectedRegency?.name || '', district: '', village: '' }));
  };

  const handleDistrictChange = async (value: string) => {
    const selectedDistrict = districts.find(dist => dist.id === value);
    const data = await fetchVillages(value);
    setVillages(data);
    dispatch(updateForm({ district: selectedDistrict?.name || '', village: '' }));
  };

  const onFinish = (values: any) => {
    const { province, regency, district, village } = form.getFieldsValue();

    // Mengonversi birthDate ke string
    const birthDateString = values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null;

    // Update Redux store dengan nilai terbaru
    const updatedValues = {
      ...values,
      birthDate: birthDateString,
      province: provinces.find(prov => prov.id === province)?.name || province,
      regency: regencies.find(reg => reg.id === regency)?.name || regency,
      district: districts.find(dist => dist.id === district)?.name || district,
      village: villages.find(vil => vil.id === village)?.name || village,
    };

    dispatch(updateForm(updatedValues));
    onNext(); // Panggil callback untuk melanjutkan ke Step 2
  };

  return (
    <Card title="Step 1: Isi Biodata" className="registration-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...formData,
          birthDate: formData.birthDate ? dayjs(formData.birthDate) : null, // Pastikan birthDate dalam format Dayjs
        }}
        className="registration-form"
        autoComplete="off"
      >
        <Form.Item
          label="Nama Lengkap"
          name="fullName"
          rules={[{ required: true, message: 'Nama lengkap wajib diisi!' }]}
        >
          <Input 
            placeholder="Masukkan nama lengkap"
            onChange={(e) => dispatch(updateForm({ fullName: e.target.value }))} 
          />
        </Form.Item>

        <Form.Item
          label="Email Aktif"
          name="email"
          rules={[{ required: true, message: 'Email wajib diisi!' }]}
        >
          <Input 
            placeholder="Masukkan Email Aktif"
            onChange={(e) => dispatch(updateForm({ email: e.target.value }))} 
          />
        </Form.Item>

        <Form.Item
          label="Tanggal Lahir"
          name="birthDate"
          rules={[{ required: true, message: 'Tanggal lahir wajib diisi!' }]}
        >
          <DatePicker 
            className="full-width"
            placeholder="Pilih tanggal lahir"
            onChange={(date: Dayjs | null) => {
              dispatch(updateForm({ birthDate: date ? date.format('YYYY-MM-DD') : null }));
            }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Nomor Telepon WhatsApp"
          name="phone"
          rules={[{ required: true, message: 'Nomor telepon wajib diisi!' }]}
        >
          <Input 
            placeholder="Masukkan nomor telepon"
            onChange={(e) => dispatch(updateForm({ phone: e.target.value }))} 
          />
        </Form.Item>

        <Form.Item
          label="Darimana Kamu Tau Program empowerU?"
          name="infoSource"
          rules={[{ required: true, message: 'Sumber informasi wajib dipilih!' }]}
        >
          <Select
            placeholder="Pilih sumber informasi"
            onChange={(value) => dispatch(updateForm({ infoSource: value }))} 
          >
            {['Instagram', 'Facebook', 'Twitter', 'Teman/Kerabat', 'Website', 'Lainnya'].map(source => (
              <Option key={source} value={source}>{source}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Provinsi"
          name="province"
          rules={[{ required: true, message: 'Provinsi wajib dipilih!' }]}
        >
          <Select
            placeholder="Pilih provinsi"
            onChange={handleProvinceChange}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>{province.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Kabupaten/Kota"
          name="regency"
          rules={[{ required: true, message: 'Kabupaten/Kota wajib dipilih!' }]}
        >
          <Select
            placeholder="Pilih kabupaten/kota"
            onChange={handleRegencyChange}
            disabled={!regencies.length}
          >
            {regencies.map((regency) => (
              <Option key={regency.id} value={regency.id}>{regency.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Kecamatan"
          name="district"
          rules={[{ required: true, message: 'Kecamatan wajib dipilih!' }]}
        >
          <Select
            placeholder="Pilih kecamatan"
            onChange={handleDistrictChange}
            disabled={!districts.length}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>{district.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Kelurahan/Desa"
          name="village"
          rules={[{ required: true, message: 'Kelurahan/Desa wajib dipilih!' }]}
        >
          <Select
            placeholder="Pilih kelurahan/desa"
            disabled={!villages.length}
          >
            {villages.map((village) => (
              <Option key={village.id} value={village.id}>{village.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Alamat Lengkap" name="address">
          <TextArea 
            rows={4} 
            placeholder="Masukkan alamat lengkap"
            onChange={(e) => dispatch(updateForm({ address: e.target.value }))} 
          />
        </Form.Item>

        <Form.Item
          label="Alasan Mendaftar"
          name="reason"
          rules={[{ required: true, message: 'Alasan mendaftar wajib diisi!' }]}
        >
          <TextArea 
            placeholder="Masukkan alasan mendaftar"
            className="reason-textarea"
            onChange={(e) => dispatch(updateForm({ reason: e.target.value }))} 
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Selanjutnya
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
