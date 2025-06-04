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

    console.log("Original files:", files);

    // Append each file under the same field name to create arrays
    Object.keys(files).forEach(docName => {
      const key = backendKeys[docName];
      if (key && files[docName]?.length > 0) {
        files[docName].forEach((file, index) => {
          const fileObj = file.originFileObj || file;
          if (fileObj instanceof File || fileObj instanceof Blob) {
            // Append all files with the same field name
            formData.append(key, fileObj, fileObj.name);
            console.log(`Appended: ${key} - ${fileObj.name}`);
          } else {
            console.error(`Invalid file object for ${key}:`, fileObj);
          }
        });
      }
    });

    // For debugging: log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }

    const response = await fetch(`${constant.baseUrl}api/v1/Documents/create/?BusinessId=${businessId}`, {
      method: 'POST',
      headers: { 
        "Authorization": `Bearer ${authToken}` 
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend validation errors:", errorData.detail);
      throw new Error(`Document upload failed: ${JSON.stringify(errorData.detail)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }
};