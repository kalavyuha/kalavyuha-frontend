import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { Upload as AntdUpload, message } from "antd";
import { Upload as LucideUpload } from "lucide-react";

const { Dragger } = AntdUpload;

export default function FormWithDocumentUpload({ setFileListParent }) {
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [fileList, setFileList] = useState({});

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
      handleFileChange(doc, [...currentFileList, file]);
      return false; 
    },
    onRemove: (file) => {
      const newFileList = (fileList[doc.name] || []).filter((f) => f.uid !== file.uid);
      handleFileChange(doc, newFileList);
    },
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  });

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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
