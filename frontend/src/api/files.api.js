import axiosInstance from "./axios";
import { API_ENDPOINTS } from "@config/api.config";

export const filesAPI = {
  // Get all files
  getAllFiles: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.FILES.BASE, {
      params,
    }); // ✅ Fixed
    return response.data;
  },

  // Get file by ID
  getFileById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.FILES.BY_ID(id)); // ✅ Fixed
    return response.data;
  },

  // Get my created files
  getMyFiles: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.FILES.MY_FILES); // ✅ Fixed
    return response.data;
  },

  // Get pending files for current user
  getPendingFiles: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.FILES.PENDING); // ✅ Fixed
    return response.data;
  },

  // Create new file
  createFile: async (fileData) => {
    const formData = new FormData();

    formData.append("title", fileData.title);
    formData.append("description", fileData.description || "");
    formData.append("fileType", fileData.fileType);
    formData.append("department", fileData.department);

    // Add attachments if any
    if (fileData.attachments && fileData.attachments.length > 0) {
      fileData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.FILES.BASE,
      formData,
      {
        // ✅ Fixed
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Process file action (approve/reject/revision) - ✅ Fixed
  processFileAction: async (
    id,
    action,
    remarks,
    signatureData,
    signaturePlacement,
  ) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FILES.ACTION(id), {
      action,
      remarks,
      signatureData,
      signaturePlacement,
    });
    return response.data;
  },

  // Get file holder info
  getFileHolderInfo: async (id) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.FILES.HOLDER_INFO(id),
    ); // ✅ Fixed
    return response.data;
  },

  // ✅ Update file
  updateFile: async (id, fileData) => {
    const formData = new FormData();

    formData.append("title", fileData.title);
    formData.append("description", fileData.description || "");
    formData.append("fileType", fileData.fileType);
    formData.append("department", fileData.department);

    if (fileData.attachments && fileData.attachments.length > 0) {
      fileData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axiosInstance.put(
      API_ENDPOINTS.FILES.BY_ID(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // ✅ Delete file
  deleteFile: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.FILES.BY_ID(id));
    return response.data;
  },

  // Process file action (approve/reject/revision)
  processFileAction: async (
    id,
    action,
    remarks,
    signatureData,
    signaturePlacement,
  ) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FILES.ACTION(id), {
      action,
      remarks,
      signatureData,
      signaturePlacement,
    });
    return response.data;
  },

  // Get file holder info
  getFileHolderInfo: async (id) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.FILES.HOLDER_INFO(id),
    );
    return response.data;
  },
  // ✅ Archive file (Admin/Owner)
  archiveFile: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.FILES.BY_ID(id)}/archive`);
    return response.data;
  },
};
