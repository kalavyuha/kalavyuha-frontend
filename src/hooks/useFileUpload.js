import { useState, useCallback } from 'react';
import FileUploadUtils from '../utils/fileUploadUtils';

/**
 * Enhanced file upload hook with compression, validation, and error handling
 */
export const useFileUpload = (options = {}) => {
  const {
    maxFileSize = FileUploadUtils.MAX_FILE_SIZE,
    maxTotalSize = FileUploadUtils.MAX_TOTAL_SIZE,
    allowedTypes = FileUploadUtils.ALLOWED_TYPES,
    autoCompress = true,
    compressionQuality = FileUploadUtils.COMPRESSION_QUALITY,
    maxImageDimension = FileUploadUtils.MAX_IMAGE_DIMENSION,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setProgressMessage('');
    setError(null);
    setUploadedFiles([]);
  }, []);

  /**
   * Process and validate files before upload
   */
  const processFiles = useCallback(async (files) => {
    try {
      setError(null);
      setProgress(10);
      setProgressMessage('Validating files...');

      // Convert FileList to Array if needed
      const fileArray = Array.from(files);

      const progressCallback = FileUploadUtils.createProgressCallback(
        setProgress,
        setProgressMessage
      );

      const processedFiles = await FileUploadUtils.processFiles(fileArray, progressCallback);

      setProgress(50);
      setProgressMessage('Files processed successfully');
      
      return processedFiles;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  /**
   * Upload files to server
   */
  const uploadFiles = useCallback(async (files, uploadUrl, options = {}) => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      const {
        method = 'POST',
        headers = {},
        authToken,
        additionalData = {},
        onProgress,
      } = options;

      // Process files first
      const processedFiles = await processFiles(files);

      setProgress(60);
      setProgressMessage('Uploading files...');

      // Create FormData
      const formData = new FormData();

      // Add additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      // Add files
      processedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file, file.name);
      });

      // Prepare headers
      const uploadHeaders = { ...headers };
      if (authToken) {
        uploadHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      // Perform upload with timeout and size limits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

      try {
        const response = await fetch(uploadUrl, {
          method,
          headers: uploadHeaders,
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        setProgress(90);
        setProgressMessage('Processing response...');

        const result = await FileUploadUtils.handleUploadResponse(response);

        setProgress(100);
        setProgressMessage('Upload completed successfully');
        setUploadedFiles(processedFiles);

        return result;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Upload timed out. Please try again with smaller files.');
        }
        
        throw fetchError;
      }

    } catch (error) {
      setError(error.message);
      setProgress(0);
      setProgressMessage('');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [processFiles]);

  /**
   * Upload single file
   */
  const uploadFile = useCallback(async (file, uploadUrl, options = {}) => {
    return uploadFiles([file], uploadUrl, options);
  }, [uploadFiles]);

  /**
   * Validate file without uploading
   */
  const validateFile = useCallback((file) => {
    try {
      FileUploadUtils.validateFile(file);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }, []);

  /**
   * Compress image file
   */
  const compressImage = useCallback(async (file, quality = compressionQuality) => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('File is not an image');
      }

      setProgressMessage('Compressing image...');
      const compressedFile = await FileUploadUtils.compressImage(file, maxImageDimension, quality);
      setProgressMessage(`Compressed from ${FileUploadUtils.formatFileSize(file.size)} to ${FileUploadUtils.formatFileSize(compressedFile.size)}`);
      
      return compressedFile;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [compressionQuality, maxImageDimension]);

  return {
    // State
    isUploading,
    progress,
    progressMessage,
    error,
    uploadedFiles,

    // Actions
    uploadFiles,
    uploadFile,
    processFiles,
    validateFile,
    compressImage,
    reset,

    // Utilities
    formatFileSize: FileUploadUtils.formatFileSize,
  };
};

export default useFileUpload;
