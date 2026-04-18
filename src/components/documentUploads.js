import React, { useState, useEffect } from "react";
import { Box, Grid, Modal } from "@mui/material";
import { Upload as AntdUpload, message } from "antd";
import { Upload as LucideUpload, X, Eye } from "lucide-react";

const { Dragger } = AntdUpload;

// File compression utility
const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Validate file size and type
const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not supported. Please upload images, PDF, or Word documents.`);
  }

  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`);
  }

  return true;
};

// Add CSS animation styles
const animationStyles = `
  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function FormWithDocumentUpload({ setFileListParent, initialFiles }) {
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [fileList, setFileList] = useState(initialFiles || {});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Inject CSS styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const documentTypes = [
    { name: "Pan Card (Owner)", notMoreThen: 1, required: true },
    { name: "GST Certificate", notMoreThen: 1, required: true },
    { name: "Business License", notMoreThen: 1, required: false },
    { name: "Insurance Certificate", notMoreThen: 2, required: false },
    { name: "Utility Bills", notMoreThen: 2, required: true },
    { name: "Upload Images", notMoreThen: 5, required: false, subtitle: "(for gallery)" },
  ];

  const handleFileChange = (doc, fileListNew) => {
    const updatedFileList = { ...fileList, [doc.name]: fileListNew };
    setFileList(updatedFileList);
    setFileListParent(updatedFileList);
  };

  const handlePreview = async (file) => {
    if (file.type.startsWith('image/')) {
      setPreviewImage(URL.createObjectURL(file));
      setPreviewVisible(true);
    } else {
      message.info('Preview available only for image files');
    }
  };

  const uploadProps = (doc) => ({
    name: "file",
    multiple: false,
    fileList: fileList[doc.name] || [],
    beforeUpload: async (file) => {
      try {
        // Validate file
        validateFile(file);
        
        const currentFileList = fileList[doc.name] || [];
        if (currentFileList.length >= doc.notMoreThen) {
          message.error(`Only ${doc.notMoreThen} files allowed for ${doc.name}.`);
          return false;
        }

        let processedFile = file;
        
        // Compress images if they're too large
        if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) { // Compress if > 2MB
          message.loading('Compressing image...', 0);
          try {
            processedFile = await compressImage(file);
            message.destroy();
            message.success(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
          } catch (compressionError) {
            message.destroy();
            console.error('Compression failed:', compressionError);
            message.warning('Could not compress image, uploading original file');
            processedFile = file;
          }
        }

        // Final size check after compression
        if (processedFile.size > 5 * 1024 * 1024) {
          message.error('File is still too large after compression. Please choose a smaller file.');
          return false;
        }
        
        const uploadFile = new File([processedFile], file.name, { type: processedFile.type });
        handleFileChange(doc, [...currentFileList, uploadFile]);
        
        return false; // Prevent default upload
      } catch (error) {
        message.error(error.message);
        return false;
      }
    },
    onRemove: (file) => {
      const newFileList = (fileList[doc.name] || []).filter((f) => f.uid !== file.uid);
      handleFileChange(doc, newFileList);
    },
    showUploadList: false,
  });

  const renderUploadedFiles = (doc) => {
    const files = fileList[doc.name] || [];
    
    return (
      <div style={{ 
        marginTop: "8px",
        transition: "all 0.3s ease-in-out"
      }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              border: "1px solid #e2e6ea",
              borderRadius: "4px",
              marginBottom: "8px",
              background: "#fafafa",
              transition: "all 0.3s ease-in-out",
              transform: "translateY(0)",
              opacity: 1,
              animation: `fadeInSlide 0.3s ease-in-out ${index * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              e.target.style.background = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#fafafa";
            }}
          >
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {file.name}
              </div>
              <div style={{ fontSize: "10px", color: "#8eabbb" }}>
                {(file.size / 1024).toFixed(2)} KB
                {file.size > 1024 * 1024 && (
                  <span style={{ color: "#ff6b6b", marginLeft: "4px" }}>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handlePreview(file)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8eabbb",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => {
                  const newFileList = files.filter((_, i) => i !== index);
                  handleFileChange(doc, newFileList);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff4d4f",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box sx={{ mt: 1, maxWidth: 600, width: "100%", mx: 4 }}>
      <Grid container spacing={2}>
        {documentTypes.map((doc) => (
          <Grid item xs={12} md={6} key={doc.name}>
            <h3 style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}>
              {doc.name}
              {doc.required && <span style={{ color: "red" }}>*</span>}
              {doc.subtitle && (
                <span style={{ marginLeft: "8px", fontSize: "12px", color: "gray" }}>{doc.subtitle}</span>
              )}
            </h3>
            <Dragger
              {...uploadProps(doc)}
              onMouseEnter={() => setHighlightedSection(doc.name)}
              onMouseLeave={() => setHighlightedSection(null)}
              style={{
                borderWidth: "2px",
                borderStyle: "dashed",
                borderColor: highlightedSection === doc.name ? "#8eabbb" : "#e2e6ea",
                borderRadius: "6px",
              }}
            >
              <div style={{ marginTop: 0, marginBottom: 2, color: "#8eabbb", fontSize: "12px" }}>
                <LucideUpload size={32} color="#8eabbb" />
              </div>
              <div style={{ margin: 0, color: "#8eabbb", fontSize: "12px" }}>
                Click to upload or drag and drop
              </div>
            </Dragger>

            {fileList[doc.name]?.length > 0 && renderUploadedFiles(doc)}
          </Grid>
        ))}
      </Grid>

      <Modal
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ background: "white", padding: "16px", maxWidth: "90vw", maxHeight: "90vh" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <button
              onClick={() => setPreviewVisible(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#8eabbb"
              }}
            >
              <X size={24} />
            </button>
          </div>
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block" }}
          />
        </div>
      </Modal>
      
    </Box>
  );
}