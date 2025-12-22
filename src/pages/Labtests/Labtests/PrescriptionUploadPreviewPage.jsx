import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext.jsx";
import { useDropzone } from "react-dropzone";

const PrescriptionUploadPreviewPage = () => {
  const { prescriptions, uploadPrescription, clearPrescription } = useContext(CartContext);
  const [previewFiles, setPreviewFiles] = useState([]);
  const navigate = useNavigate();

  // Initialize previewFiles from context on mount
  useEffect(() => {
    if (prescriptions?.length) {
      const filesWithPreview = prescriptions.map(file => {
        if (file.type.startsWith("image/")) {
          file.preview = URL.createObjectURL(file);
        }
        return file;
      });
      setPreviewFiles(filesWithPreview);
    }
  }, [prescriptions]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewFiles.forEach(file => {
        if (file.type.startsWith("image/")) URL.revokeObjectURL(file.preview);
      });
    };
  }, [previewFiles]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": []
    },
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      // Clear previous files
      clearPrescription();

      // Add preview URLs for images
      const filesWithPreview = acceptedFiles.map(file => {
        if (file.type.startsWith("image/")) {
          file.preview = URL.createObjectURL(file);
        }
        return file;
      });

      uploadPrescription(filesWithPreview);
      setPreviewFiles(filesWithPreview);
    },
  });

  const handleRemoveFile = (index) => {
    const updatedFiles = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(updatedFiles);
    clearPrescription();
    uploadPrescription(updatedFiles);
  };

  const handleNext = () => {
    navigate("/individualtestlist");
  };

  return (
    <Container className="mt-5 mb-5 pt-3 pb-3 uplo-page">
      <h3 className="mb-2 text-center">Upload Your Prescription</h3>
      <p className="text-center text-muted mb-4">
        Upload multiple images or PDFs. You can review before proceeding.
      </p>

      {/* Drag and Drop Zone */}
      <div
        {...getRootProps()}
        className={`w-50 border border-dashed p-4 text-center mb-4 rounded ${
          isDragActive ? "bg-light" : "bg-white"
        }`}
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="mb-0">Drop the files here ...</p>
        ) : (
          <p className="mb-0">
            Drag & drop your files here, or click to select files <br />
            <small>(Supports multiple images & PDFs)</small>
          </p>
        )}
      </div>

      {/* Preview Grid */}
      {previewFiles.length > 0 && (
        <Row className="mb-3 g-3">
          {previewFiles.map((file, i) => (
            <Col xs={6} md={3} key={i}>
              <div
                className="preview-card position-relative p-2 border rounded"
                style={{ cursor: "pointer", minHeight: "120px", textAlign: "center" }}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt="preview"
                    style={{ width: "100%", borderRadius: 4 }}
                  />
                ) : (
                  <div
                    className="pdf-placeholder d-flex align-items-center justify-content-center"
                    style={{
                      height: "100px",
                      background: "#f1f3f6",
                      borderRadius: 4,
                      padding: "0 5px",
                      fontSize: "0.9rem"
                    }}
                  >
                    📄 <span className="ms-1 text-truncate" style={{ maxWidth: "90%" }}>{file.name}</span>
                  </div>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-1"
                  onClick={() => handleRemoveFile(i)}
                >
                  ×
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {previewFiles.length > 0 && (
        <div className="text-center mt-3">
          <Button className="processs-buttonsas" onClick={handleNext}>
            Proceed
          </Button>
        </div>
      )}
    </Container>
  );
};

export default PrescriptionUploadPreviewPage;
