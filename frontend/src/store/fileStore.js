import { create } from 'zustand';
import { filesAPI } from '@api/files.api';

export const useFileStore = create((set, get) => ({
  files: [],
  currentFile: null,
  myFiles: [],
  pendingFiles: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Get all files
  fetchFiles: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.getAllFiles(params);
      set({
        files: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch files',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get file by ID
  fetchFileById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.getFileById(id);
      console.log('📄 Fetched file:', response.data.fileId, 'Attachments:', response.data.attachments);
      set({
        currentFile: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch file',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get my files
  fetchMyFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.getMyFiles();
      set({
        myFiles: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch my files',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get pending files
  fetchPendingFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.getPendingFiles();
      set({
        pendingFiles: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch pending files',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create file
  createFile: async (fileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.createFile(fileData);
      set({ isLoading: false });
      // Refresh files list
      get().fetchFiles();
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create file',
        isLoading: false,
      });
      throw error;
    }
  },
  // Add these inside the create() function, after processFileAction

  // ✅ Update file
  updateFile: async (id, fileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.updateFile(id, fileData);
      set({ isLoading: false });
      
      // Refresh my files list
      await get().fetchMyFiles();
      
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update file',
        isLoading: false,
      });
      throw error;
    }
  },

  // ✅ Delete file
  deleteFile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.deleteFile(id);
      set({ isLoading: false });
      
      // Remove from lists
      const { myFiles, files } = get();
      set({
        myFiles: myFiles.filter(f => f._id !== id),
        files: files.filter(f => f._id !== id),
      });
      
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete file',
        isLoading: false,
      });
      throw error;
    }
  },
  // ✅ Archive file
  archiveFile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filesAPI.archiveFile(id);
      set({ isLoading: false });
      
      // Refresh my files list
      await get().fetchMyFiles();
      
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to archive file',
        isLoading: false,
      });
      throw error;
    }
  },

  // ✅ Process file action (updated with signature support)
  processFileAction: async (id, action, remarks, signatureData, signaturePlacement) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📤 Sending action:', { 
        id, 
        action, 
        hasSignature: !!signatureData,
        hasPlacement: !!signaturePlacement 
      });

      // ✅ Call API with signature data
      const response = await filesAPI.processFileAction(
        id, 
        action, 
        remarks, 
        signatureData, 
        signaturePlacement
      );

      console.log('✅ Action response:', response.data);

      set({ isLoading: false });

      // ✅ Update current file if viewing
      if (get().currentFile?._id === id) {
        console.log('🔄 Refreshing current file after action');
        await get().fetchFileById(id);
      }

      // Refresh pending files
      await get().fetchPendingFiles();

      return response;
    } catch (error) {
      console.error('❌ Action error:', error.response?.data || error.message);
      set({
        error: error.response?.data?.message || 'Failed to process file action',
        isLoading: false,
      });
      throw error;
    }
  },

  // ✅ Force update file from socket event
  updateFileFromSocket: (fileData) => {
    const { currentFile, files, myFiles, pendingFiles } = get();

    console.log('🔄 Socket update received:', fileData.fileId, 'Attachments:', fileData.attachments);

    // Update current file if viewing
    if (currentFile && (currentFile._id === fileData._id || currentFile.fileId === fileData.fileId)) {
      console.log('🔄 Updating currentFile with new attachments');
      set({ 
        currentFile: { 
          ...currentFile, 
          ...fileData,
          attachments: fileData.attachments, // ✅ Force attachment update
          updatedAt: fileData.updatedAt || new Date().toISOString(),
        } 
      });
    }

    // Update in lists
    const updateList = (list) => 
      list.map(f => 
        (f._id === fileData._id || f.fileId === fileData.fileId) 
          ? { ...f, ...fileData, attachments: fileData.attachments, updatedAt: fileData.updatedAt }
          : f
      );

    set({
      files: updateList(files),
      myFiles: updateList(myFiles),
      pendingFiles: updateList(pendingFiles),
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current file
  clearCurrentFile: () => set({ currentFile: null }),
}));