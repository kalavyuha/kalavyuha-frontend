import React, { useState } from "react";
import { Box, Grid, Modal } from "@mui/material";
import { Upload as AntdUpload, message } from "antd";
import { Upload as LucideUpload, X, Eye } from "lucide-react";

const { Dragger } = AntdUpload;

export default function FormWithDocumentUpload({ setFileListParent, initialFiles }) {
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [fileList, setFileList] = useState(initialFiles || {});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
    beforeUpload: (file) => {
      const currentFileList = fileList[doc.name] || [];
      if (currentFileList.length >= doc.notMoreThen) {
        message.error(`Only ${doc.notMoreThen} files allowed for ${doc.name}.`);
        return false;
      }
      
      const uploadFile = new File([file], file.name, { type: file.type });
      handleFileChange(doc, [...currentFileList, uploadFile]);
      return false;
    },
    onRemove: (file) => {
      const newFileList = (fileList[doc.name] || []).filter((f) => f.uid !== file.uid);
      handleFileChange(doc, newFileList);
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  });

  const renderUploadedFiles = (doc) => {
    const files = fileList[doc.name] || [];
    
    return (
      <div style={{ marginTop: "8px" }}>
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
              background: "#fafafa"
            }}
          >
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {file.name}
              </div>
              <div style={{ fontSize: "10px", color: "#8eabbb" }}>
                {(file.size / 1024).toFixed(2)} KB
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
              // {...uploadProps(doc)}
              className="border-2 border-dashed rounded-md"
              onMouseEnter={() => setHighlightedSection(doc.name)}
              onMouseLeave={() => setHighlightedSection(null)}
              style={{
                borderColor: highlightedSection === doc.name ? "#8eabbb" : "#e2e6ea",
              }}
            >
              <p className="ant-upload-drag-icon" style={{ marginTop: 0, marginBottom: 2, color: "#8eabbb", fontSize: "12px" }}>
                <LucideUpload className="text-3xl text-gray-400" />
              </p>
              <p className="ant-upload-text text-sm text-gray-500" style={{ margin: 0, color: "#8eabbb", fontSize: "12px" }}>
                Click to upload or drag and drop
              </p>
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