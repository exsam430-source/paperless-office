import { useFileStore } from "@store/fileStore";
import { useNotifications } from "./useNotifications";

export const useFiles = () => {
  const {
    files,
    currentFile,
    myFiles,
    pendingFiles,
    isLoading,
    error,
    fetchFiles,
    fetchFileById,
    fetchMyFiles,
    fetchPendingFiles,
    createFile,
    updateFile,     // ✅ Add this
    deleteFile,     // ✅ Add this
    archiveFile,  // ✅ Add this
    processFileAction,
    clearError,
    clearCurrentFile,
  } = useFileStore();

  const { showToast } = useNotifications();

  // ✅ Approve file with signature
  const approveFile = async (
    id,
    remarks = "",
    signatureData = "",
    signaturePlacement = null,
  ) => {
    const response = await processFileAction(
      id,
      "APPROVE",
      remarks,
      signatureData,
      signaturePlacement,
    );
    showToast("success", "File approved successfully");
    return response;
  };

  // ✅ Reject file with signature
  const rejectFile = async (
    id,
    remarks = "",
    signatureData = "",
    signaturePlacement = null,
  ) => {
    const response = await processFileAction(
      id,
      "REJECT",
      remarks,
      signatureData,
      signaturePlacement,
    );
    showToast("success", "File rejected");
    return response;
  };

  // ✅ Request revision with signature
  const requestRevision = async (
    id,
    remarks = "",
    signatureData = "",
    signaturePlacement = null,
  ) => {
    const response = await processFileAction(
      id,
      "REVISION",
      remarks,
      signatureData,
      signaturePlacement,
    );
    showToast("success", "Revision requested");
    return response;
  };

  return {
    files,
    currentFile,
    myFiles,
    pendingFiles,
    isLoading,
    error,
    fetchFiles,
    fetchFileById,
    fetchMyFiles,
    fetchPendingFiles,
    createFile,
    updateFile,     // ✅ Add this
    deleteFile,     // ✅ Add this
    archiveFile,  // ✅ Add this
    approveFile,
    rejectFile,
    requestRevision,
    clearError,
    clearCurrentFile,
  };
};