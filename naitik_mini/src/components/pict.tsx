import React, { useEffect, useState } from "react";
import axios from "axios";

function OCR() {
  const [image, setImage] = useState<string | null>(null); // Allow null values
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  // useEffect to retrieve image from local storage on component mount
  useEffect(() => {
    const uploadedImage = localStorage.getItem("uploadedImage");
    const ocrResult = localStorage.getItem("ocrResult");
    if (uploadedImage) {
      setImage(uploadedImage);
    }
    if (ocrResult) {
      setOcrResult(ocrResult);
    }
  }, []); // Empty dependency array to run only on mount

  const handleUpload = async () => {
    if (image) {
      try {
        // Send image using Axios
        const response = await axios.post("http://localhost:5000/ocr", { image });
        console.log("Image sent to localhost:5000/ocr");
        localStorage.removeItem("uploadedImage");
        const ocrResult = response.data; // Assuming response.data contains OCR result
        localStorage.setItem("ocrResult", ocrResult);
        setOcrResult(ocrResult);
        setImage(null);
      } catch (error) {
        console.error("Error sending image:", error);
      }
    }
  };

  const goBack = () => {
    localStorage.removeItem("uploadedImage");
    localStorage.removeItem("ocrResult");
    setImage(null);
    setOcrResult(null);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImage(base64String);
        localStorage.setItem("uploadedImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div style={{ marginLeft: "1rem", marginBottom: "1.5rem" }}>
            <div className="card-heading">OCR Dark Pattern</div>
            <div className="card-content">
              Suspect an image has a potential dark pattern, upload image to find out
            </div>
          </div>
        </div>
        <div className="buttons">
          {ocrResult ? (
            <>
              <button className="secondary-button" onClick={goBack}> Go Back</button>
              <div>{ocrResult}</div>
            </>
          ) : image ? (
            <>
              <button className="secondary-button" onClick={goBack}> Go Back</button>
              <button className="primary-button" onClick={handleUpload}>
                OCR
              </button>
            </>
          ) : (
            <label htmlFor="upload-button" className="primary-button">
              Upload Image
            </label>
          )}
          <input
            type="file"
            accept="image/*"
            id="upload-button"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}

export default OCR;
