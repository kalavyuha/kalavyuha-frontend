// File upload utilities for handling large files and compression
export class FileUploadUtils {
  static MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  static MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total
  static MAX_IMAGE_DIMENSION = 1920;
  static COMPRESSION_QUALITY = 0.8;

  static ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  /**
   * Validate a single file
   */
  static validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type "${file.type}" is not supported. Please upload images, PDF, Word documents, or text files.`);
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`);
    }

    return true;
  }

  /**
   * Validate total size of multiple files
   */
  static validateTotalSize(files) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    if (totalSize > this.MAX_TOTAL_SIZE) {
      throw new Error(`Total file size is too large (${(totalSize / 1024 / 1024).toFixed(2)}MB). Maximum allowed total size is 25MB.`);
    }

    return true;
  }

  /**
   * Compress an image file
   */
  static compressImage(file, maxWidth = this.MAX_IMAGE_DIMENSION, quality = this.COMPRESSION_QUALITY) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file); // Return original file if not an image
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
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
  }

  /**
   * Process a file (validate and compress if needed)
   */
  static async processFile(file, onProgress = null) {
    try {
      // Validate file
      this.validateFile(file);
      
      // If it's an image and larger than 2MB, compress it
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
        if (onProgress) onProgress('Compressing image...');
        
        try {
          const compressedFile = await this.compressImage(file);
          
          // Check if compression helped
          if (compressedFile.size < file.size) {
            if (onProgress) {
              onProgress(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            }
            return compressedFile;
          } else {
            if (onProgress) onProgress('Compression did not reduce file size, using original');
            return file;
          }
        } catch (compressionError) {
          console.warn('Image compression failed:', compressionError);
          if (onProgress) onProgress('Compression failed, using original file');
          return file;
        }
      }
      
      return file;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process multiple files
   */
  static async processFiles(files, onProgress = null) {
    const processedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) onProgress(`Processing file ${i + 1} of ${files.length}: ${file.name}`);
      
      try {
        const processedFile = await this.processFile(file, onProgress);
        processedFiles.push(processedFile);
      } catch (error) {
        throw new Error(`Failed to process "${file.name}": ${error.message}`);
      }
    }

    // Validate total size
    this.validateTotalSize(processedFiles);
    
    return processedFiles;
  }

  /**
   * Get human readable file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create a progress callback that can be used with UI components
   */
  static createProgressCallback(setProgress, setMessage) {
    return (message) => {
      if (setMessage) setMessage(message);
      if (setProgress) {
        // Extract percentage if it's in the message
        const percentMatch = message.match(/(\d+)%/);
        if (percentMatch) {
          setProgress(parseInt(percentMatch[1]));
        }
      }
    };
  }

  /**
   * Enhanced error handling for upload responses
   */
  static handleUploadResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (response.status === 413) {
        errorMessage = "Files are too large for upload. Please compress your files and try again.";
      } else if (response.status === 422) {
        errorMessage = "Invalid file format or content. Please check your files and try again.";
      } else if (response.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }
      
      throw new Error(errorMessage);
    }

    // Check if response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Server returned non-JSON response');
      return { success: true, message: "Upload completed successfully" };
    }

    return response.json();
  }
}

export default FileUploadUtils;
