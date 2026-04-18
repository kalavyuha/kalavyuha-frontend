import axios from 'axios';
import { constant } from '../../../constant';

export const uploadImages = async (files, token) => {
  try {
    const formData = new FormData();
    
    // Validate files before upload
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxTotalSize = 25 * 1024 * 1024; // 25MB
    let totalSize = 0;

    files.forEach((file, index) => {
      if (file.size > maxFileSize) {
        throw new Error(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB per file.`);
      }
      totalSize += file.size;
      formData.append('images', file);
    });

    if (totalSize > maxTotalSize) {
      throw new Error(`Total file size is too large (${(totalSize / 1024 / 1024).toFixed(2)}MB). Maximum allowed total size is 25MB.`);
    }

    const response = await axios.post(`${constant.baseUrl}/api/v1/files/upload/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      timeout: 60000, // 60 seconds timeout
      maxContentLength: 50 * 1024 * 1024, // 50MB max content length
      maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    let errorMessage = 'Failed to upload images';
    
    if (error.response) {
      const { status } = error.response;
      
      if (status === 413) {
        errorMessage = 'Files are too large for upload. Please compress your files and try again.';
      } else if (status === 422) {
        errorMessage = 'Invalid file format. Please check your files and try again.';
      } else if (status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Upload timeout. Please try again with smaller files.';
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      data: null, 
      error: errorMessage
    };
  }
};

// Enhanced file upload utility with compression support
export const uploadFileWithCompression = async (file, token, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    compressionQuality = 0.8,
    maxDimension = 1920,
  } = options;

  try {
    let processedFile = file;

    // Compress image if it's too large
    if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
      processedFile = await compressImage(file, maxDimension, compressionQuality);
    }

    // Final size check
    if (processedFile.size > maxSize) {
      throw new Error(`File is still too large after compression (${(processedFile.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed size is ${(maxSize / 1024 / 1024).toFixed(2)}MB.`);
    }

    return await uploadImages([processedFile], token);
  } catch (error) {
    throw error;
  }
};

// Image compression utility
const compressImage = (file, maxDimension = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions
        const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};