"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, DatePicker, Select, Button, Card, Space } from "antd";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs"; // Impor dayjs
import {
  fetchProvinces,
  fetchRegencies,
  fetchDistricts,
  fetchVillages,
} from "@/utils/api";

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

  // Ambil data dari localStorage jika ada dan set nilai form
  useEffect(() => {
    const savedFormData = localStorage.getItem("registrationStep1Data");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      // Pastikan birthDate valid sebelum mengonversinya ke dayjs
      const birthDate = parsedData.birthDate
        ? dayjs(parsedData.birthDate)
        : null;
      form.setFieldsValue({ ...parsedData, birthDate });
    }
  }, []);

  const handleProvinceChange = async (value: string) => {
    const selectedProvince = provinces.find((prov) => prov.id === value);
    form.setFieldsValue({
      regency: undefined,
      district: undefined,
      village: undefined,
    });
    const data = await fetchRegencies(value);
    setRegencies(data);
    setDistricts([]);
    setVillages([]);
    dispatch(
      updateForm({
        province: selectedProvince?.name || "",
        regency: "",
        district: "",
        village: "",
      })
    );
  };

  const handleRegencyChange = async (value: string) => {
    const selectedRegency = regencies.find((reg) => reg.id === value);
    form.setFieldsValue({ district: undefined, village: undefined });
    const data = await fetchDistricts(value);
    setDistricts(data);
    setVillages([]);
    dispatch(
      updateForm({
        regency: selectedRegency?.name || "",
        district: "",
        village: "",
      })
    );
  };

  const handleDistrictChange = async (value: string) => {
    const selectedDistrict = districts.find((dist) => dist.id === value);
    const data = await fetchVillages(value);
    setVillages(data);
    dispatch(
      updateForm({ district: selectedDistrict?.name || "", village: "" })
    );
  };

  const onFinish = (values: any) => {
    const { province, regency, district, village } = form.getFieldsValue();

    // Mengonversi birthDate ke string jika valid
    const birthDateString =
      values.birthDate && values.birthDate.isValid()
        ? values.birthDate.format("YYYY-MM-DD")
        : null;

    // Update Redux store dengan nilai terbaru
    const updatedValues = {
      ...values,
      birthDate: birthDateString,
      province:
        provinces.find((prov) => prov.id === province)?.name || province,
      regency: regencies.find((reg) => reg.id === regency)?.name || regency,
      district:
        districts.find((dist) => dist.id === district)?.name || district,
      village: villages.find((vil) => vil.id === village)?.name || village,
    };

    // Simpan data ke localStorage
    localStorage.setItem(
      "registrationStep1Data",
      JSON.stringify(updatedValues)
    );

    dispatch(updateForm(updatedValues));
    onNext(); // Panggil callback untuk melanjutkan ke Step 2
  };

  return (
    <Card title="" className="registration-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="circle">1</div>
        <div className="text">Personal Information</div>
      </div>
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
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please fill your full name!!!" }]}
        >
          <Input
            placeholder="Enter your full name"
            onChange={(e) => dispatch(updateForm({ fullName: e.target.value }))}
          />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[{ required: true, message: "Please enter your email!!!" }]}
        >
          <Input
            placeholder="Example@domain.com"
            onChange={(e) => dispatch(updateForm({ email: e.target.value }))}
          />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="birthDate"
          rules={[
            { required: true, message: "Please select your birthdate!!!" },
          ]}
        >
          <DatePicker
            className="full-width"
            placeholder="Select date of birth"
            onChange={(date: Dayjs | null) => {
              if (date && date.isValid()) {
                dispatch(updateForm({ birthDate: date.format("YYYY-MM-DD") }));
              } else {
                dispatch(updateForm({ birthDate: null }));
              }
            }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="WhatsApp Number"
          name="phone"
          rules={[
            { required: true, message: "Please fill your WhatsApp Number!!!" },
          ]}
        >
          <Space.Compact>
            <Select
              defaultValue="+62"
              style={{ width: 70, height: 40 }}
              disabled
            >
              <Select.Option value="+62">+62</Select.Option>
            </Select>
            <Input
              style={{ width: "calc(100% - 70px)" }}
              placeholder="Example: 81234567890"
              onChange={(e) => {
                const phoneNumber = `+62${e.target.value}`;
                dispatch(updateForm({ phone: phoneNumber }));
              }}
            />
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label="Province"
          name="province"
          rules={[{ required: true, message: "Select your Province!!!" }]}
        >
          <Select
            placeholder="Select"
            onChange={handleProvinceChange}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Country/City"
          name="regency"
          rules={[{ required: true, message: "Select your Country/City!!!" }]}
        >
          <Select
            placeholder="Select"
            onChange={handleRegencyChange}
            disabled={!regencies.length}
          >
            {regencies.map((regency) => (
              <Option key={regency.id} value={regency.id}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="District"
          name="district"
          rules={[{ required: true, message: "Select your District!!!" }]}
        >
          <Select
            placeholder="Select"
            onChange={handleDistrictChange}
            disabled={!districts.length}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Village/Subdistrict"
          name="village"
          rules={[
            { required: true, message: "Select your Village/Subdistrict!!!" },
          ]}
        >
          <Select placeholder="Select" disabled={!villages.length}>
            {villages.map((village) => (
              <Option key={village.id} value={village.id}>
                {village.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please fill your address!!!" }]}
        >
          <TextArea
            rows={4}
            placeholder="Full address"
            onChange={(e) => dispatch(updateForm({ address: e.target.value }))}
          />
        </Form.Item>
        <Form.Item
          label="Where do you know about the empowerU programme?"
          name="infoSource"
          rules={[{ required: true, message: "Select your source!!!" }]}
        >
          <Select
            placeholder="Pick your source of info"
            onChange={(value) => dispatch(updateForm({ infoSource: value }))}
          >
            {[
              "Instagram",
              "Facebook",
              "Twitter",
              "Friends/Relations",
              "Website",
              "Other",
            ].map((source) => (
              <Option key={source} value={source}>
                {source}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className="form-footer">
          <Button type="primary" htmlType="submit" className="submit-button">
            Next
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
