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

    console.log(`Uploading ${files.length} files, total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

    const response = await axios.post(`${constant.baseUrl}api/v1/files/upload/images/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let axios set it with boundary for multipart/form-data
      },
      timeout: 60000, // 60 seconds timeout
      maxContentLength: 50 * 1024 * 1024, // 50MB max content length
      maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error uploading images:', error);
    
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
      console.log('Compressing image...');
      processedFile = await compressImage(file, maxDimension, compressionQuality);
      console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Final size check
    if (processedFile.size > maxSize) {
      throw new Error(`File is still too large after compression (${(processedFile.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed size is ${(maxSize / 1024 / 1024).toFixed(2)}MB.`);
    }

    return await uploadImages([processedFile], token);
  } catch (error) {
    console.error('Error uploading file with compression:', error);
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


// export const deleteImage = async (imageUrl, token) => {
//   try {
//     await axios.delete(`${API_BASE_URL}/api/v1/files/delete`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       data: { url: imageUrl },
//     });
//     return { success: true, error: null };
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     return { 
//       success: false, 
//       error: error.response?.data?.message || 'Failed to delete image' 
//     };
//   }
// };

// export const getUploadUrl = async (fileName, fileType, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/v1/files/upload-url`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       params: {
//         file_name: fileName,
//         file_type: fileType,
//       },
//     });
//     return { url: response.data.url, error: null };
//   } catch (error) {
//     console.error('Error getting upload URL:', error);
//     return { url: null, error: error.response?.data?.message || 'Failed to get upload URL' };
//   }
// };