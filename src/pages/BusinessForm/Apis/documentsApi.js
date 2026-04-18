import { constant } from '../../../constant';

export const uploadDocuments = async (businessId, files, authToken) => {
  try {
    const formData = new FormData();

    const backendKeys = {
      "Pan Card (Owner)": "PanCard",
      "GST Certificate": "GstCertification",
      "Business License": "BusinessLicense",
      "Insurance Certificate": "InsuranceCertificate",
      "Utility Bills": "UtilityBills",
      "Upload Images": "Images",
    };

    let totalSize = 0;
    const maxFileSize = 5 * 1024 * 1024; // 5MB per file
    const maxTotalSize = 25 * 1024 * 1024; // 25MB total

    // Append each file under the same field name to create arrays
    Object.keys(files).forEach(docName => {
      const key = backendKeys[docName];
      if (key && files[docName]?.length > 0) {
        files[docName].forEach((file, index) => {
          const fileObj = file.originFileObj || file;
          if (fileObj instanceof File || fileObj instanceof Blob) {
            // Check individual file size
            if (fileObj.size > maxFileSize) {
              throw new Error(`File "${fileObj.name}" is too large (${(fileObj.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed size is 5MB per file.`);
            }
            
            totalSize += fileObj.size;
            
            // Append all files with the same field name
            formData.append(key, fileObj, fileObj.name);
          }
        });
      }
    });

    // Check total size
    if (totalSize > maxTotalSize) {
      throw new Error(`Total file size is too large (${(totalSize / 1024 / 1024).toFixed(2)}MB). Maximum allowed total size is 25MB.`);
    }

    const response = await fetch(`${constant.baseUrl}/api/v1/business-documents/upload`, {
      method: 'POST',
      headers: { 
        "Authorization": `Bearer ${authToken}` 
      },
      body: formData,
    });

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          
          if (response.status === 413) {
            errorMessage = "Files are too large for upload. Please compress your files and try again.";
          } else if (errorData.detail) {
            errorMessage = `Document upload failed: ${JSON.stringify(errorData.detail)}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else {
          if (response.status === 413) {
            errorMessage = "Files are too large for upload. Please reduce file sizes and try again.";
          } else {
            errorMessage = `Server error: Unable to process upload (${response.status})`;
          }
        }
      } catch (parseError) {
        if (response.status === 413) {
          errorMessage = "Upload failed: Files are too large. Please compress your files and try again.";
        }
      }
      
      throw new Error(errorMessage);
    }

    // Parse successful response
    try {
      return await response.json();
    } catch (jsonError) {
      // If we can't parse the response but the request was successful, 
      // return a success indicator
      return { success: true, message: "Documents uploaded successfully" };
    }

  } catch (error) {
    // Provide user-friendly error messages
    if (error.message.includes('413') || error.message.includes('too large')) {
      throw new Error('Files are too large for upload. Please compress your files to under 5MB each and try again.');
    } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
      throw new Error('Network error during upload. Please check your connection and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Upload timed out. Please try again with smaller files.');
    }
    
    throw error;
  }
};