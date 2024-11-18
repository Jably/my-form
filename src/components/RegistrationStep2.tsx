import { Button, Card, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateForm } from "@/store/formSlice";
import React, { useState, useEffect } from "react";
import "../app/globals.css";

interface RegistrationStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({
  onNext,
  onBack,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);
  const [selectedOption, setSelectedOption] = useState<string>(
    formData.option || ""
  );
  const [price, setPrice] = useState<string>(formData.price || "");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);

    const prices: { [key: string]: string } = {
      "EarlyBird 1": "Rp 100.000",
      "EarlyBird 2": "Rp 125.000",
      Regular: "Rp 150.000",
      "Fast Track": "Rp 20",
    };

    setPrice(prices[option] || "");
  };

  const onFinish = () => {
    const selectedData = { option: selectedOption, price };

    // Menyimpan data yang dipilih ke localStorage
    localStorage.setItem("registrationStep2Data", JSON.stringify(selectedData));

    dispatch(updateForm({ option: selectedOption, price })); // Menyimpan data ke Redux
    onNext(); // Pindah ke langkah berikutnya
  };

  // Mengambil data dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedData = localStorage.getItem("registrationStep2Data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedOption(parsedData.option);
      setPrice(parsedData.price);
    }
  }, []);

  return (
    <Card title="" className="registration-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="circle">2</div>
        <div className="text">Select Registration Path</div>
      </div>
      {/* <div className="step2-description">
        Silahkan pilih opsi pendaftaran sesuai dengan preferensi-mu.
      </div> */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onFinish();
        }}
        className="registration-form"
      >
        <div
          className="registration-path"
          style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
        >
          <Card
            className={`option-card ${
              selectedOption === "Fast Track" ? "selected" : ""
            }`}
            title={
              <div
                className={"ant-card-title2"}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Radio
                  checked={selectedOption === "Fast Track"}
                  onChange={() => handleOptionChange("Fast Track")}
                />
                <span>Fast Track Registration</span>
              </div>
            }
            style={{ flex: "1 1 calc(50% - 16px)" }}
            onClick={() => handleOptionChange("Fast Track")}
          >
            <div className="regist-info">
              <p>Registration: 1-31 November 2024</p>
              <p>
                Last Submission:{" "}
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                30 November 2024
              </p>
              <p>
                Terms:
                <ul>
                  <li>Do not need to do administrative selection process</li>
                </ul>
              </p>
              <p>
                <ul>
                  <li>
                    <strong>Free Exclusive Webinar:</strong> Persiapan
                    Memperoleh Beasiswa Studi Ke Luar Negeri
                  </li>
                </ul>
              </p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 200.000
            </div>
          </Card>

          <Card
            className={`option-card ${
              selectedOption === "EarlyBird 1" ? "selected" : ""
            }`}
            title={
              <div
                className={"ant-card-title2"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "500",
                }}
              >
                <Radio
                  checked={selectedOption === "EarlyBird 1"}
                  onChange={() => handleOptionChange("EarlyBird 1")}
                />
                <span>EarlyBird 1</span>
              </div>
            }
            style={{ flex: "1 1 calc(50% - 16px)" }}
            onClick={() => handleOptionChange("EarlyBird 1")}
          >
            <div className="regist-info">
              <p>Registration: 1-7 November 2024</p>
              <p>
                Last Submission:{" "}
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                30 November 2024
              </p>
              <p>
                Terms:
                <ul>
                  <li>
                    Upload Twibbon ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                  <li>
                    Upload Poster ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                </ul>
              </p>
              <p>
                <ul>
                  <li>
                    <strong>Free Exclusive Webinar:</strong> Persiapan
                    Memperoleh Beasiswa Studi Ke Luar Negeri
                  </li>
                </ul>
              </p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 100.000
            </div>
          </Card>

          <Card
            className={`option-card ${
              selectedOption === "EarlyBird 2" ? "selected" : ""
            }`}
            title={
              <div
                className={"ant-card-title2"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "500",
                }}
              >
                <Radio
                  checked={selectedOption === "EarlyBird 2"}
                  onChange={() => handleOptionChange("EarlyBird 2")}
                />
                <span>EarlyBird 2</span>
              </div>
            }
            style={{ flex: "1 1 calc(50% - 16px)" }}
            onClick={() => handleOptionChange("EarlyBird 2")}
          >
            <div className="regist-info">
              <p>Registration: 8-14 November 2024</p>
              <p>
                Last Submission:{" "}
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                30 November 2024
              </p>
              <p>
                Terms:
                <ul>
                  <li>
                    Upload Twibbon ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                  <li>
                    Upload Poster ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                </ul>
              </p>
              <p>
                <ul>
                  <li>
                    <strong>Free Exclusive Webinar:</strong> Persiapan
                    Memperoleh Beasiswa Studi Ke Luar Negeri
                  </li>
                </ul>
              </p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 125.000
            </div>
          </Card>

          <Card
            className={`option-card ${
              selectedOption === "Regular" ? "selected" : ""
            }`}
            title={
              <div
                className={"ant-card-title2"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "500",
                }}
              >
                <Radio
                  checked={selectedOption === "Regular"}
                  onChange={() => handleOptionChange("Regular")}
                />
                <span>Regular</span>
              </div>
            }
            style={{ flex: "1 1 calc(50% - 16px)" }}
            onClick={() => handleOptionChange("Regular")}
          >
            <div className="regist-info">
              <p>Registration: 15-30 November 2024</p>
              <p>
                Last Submission:{" "}
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                30 November 2024
              </p>
              <p>
                Terms:
                <ul>
                  <li>
                    Upload Twibbon ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                  <li>
                    Upload Poster ke Instagram dan tag akun media sosial
                    EmpowerU
                  </li>
                </ul>
              </p>
              <p>
                <ul>
                  <li>
                    <strong>Free Exclusive Webinar:</strong> Persiapan
                    Memperoleh Beasiswa Studi Ke Luar Negeri
                  </li>
                </ul>
              </p>
            </div>
            <div className="commitment-fee">
              <strong>Commitment Fee: </strong> Rp 150.000
            </div>
          </Card>
        </div>

        <div
          className="button-group"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <Button onClick={onBack} className="back-button">
            Previous
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            disabled={!selectedOption}
          >
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
};
