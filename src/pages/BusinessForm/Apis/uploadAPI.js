import axios from 'axios';
import { constant } from '../../../constant';

export const uploadImages = async (files, token) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post(`${constant.baseUrl}api/v1/files/upload/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error uploading images:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Failed to upload images' 
    };
  }
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