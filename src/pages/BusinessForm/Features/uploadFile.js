import { useState } from 'react';

const useFileUpload = (apiEndpoint) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const uploadFile = async (file) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);
    setFileUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      const promise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.fileUrl);
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
      });

      xhr.open('POST', apiEndpoint, true);
      xhr.send(formData);

      const url = await promise;
      setFileUrl(url);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress, error, fileUrl };
};

export default useFileUpload;