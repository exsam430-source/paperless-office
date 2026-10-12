import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, CheckCircle, XCircle, AlertCircle, PenTool } from "lucide-react";

import { useAuth } from "@hooks/useAuth";
import { useFiles } from "@hooks/useFiles";
import { useNotifications } from "@hooks/useNotifications";

import Card from "@components/common/Card";
import Badge from "@components/common/Badge";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import EmptyState from "@components/common/EmptyState";
import LoadingSpinner from "@components/common/LoadingSpinner";

import DocumentSignerModal from "@components/files/DocumentSignerModal";

import { getUploadUrl } from "@utils/fileUrls";
import { formatDateTime, formatRelativeTime, formatPriorityLabel } from "@utils/formatters";
import { cn } from "@utils/cn";

export default function PendingFiles() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const {
    pendingFiles,
    fetchPendingFiles,
    approveFile,
    rejectFile,
    requestRevision,
    isLoading,
  } = useFiles();

  const [selectedFile, setSelectedFile] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: null });
  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);

  // ✅ Signature state
  const [signOpen, setSignOpen] = useState(false);
  const [signAttachmentIndex, setSignAttachmentIndex] = useState(0);
  const [signPayload, setSignPayload] = useState(null);

  const myId = user?.id || user?._id;

  const visiblePendingFiles = useMemo(() => {
    return (pendingFiles || []).filter((f) => {
      const creatorId = f?.createdBy?._id || f?.createdBy?.id;
      if (!myId || !creatorId) return true;
      return String(creatorId) !== String(myId);
    });
  }, [pendingFiles, myId]);

  useEffect(() => {
    fetchPendingFiles();
  }, []);

  // Realtime refresh
  useEffect(() => {
    const handler = async () => {
      await fetchPendingFiles();
    };
    window.addEventListener("po:fileUpdated", handler);
    return () => window.removeEventListener("po:fileUpdated", handler);
  }, [fetchPendingFiles]);

  // ✅ Get PDF attachments for signing
  const pdfAttachmentIndexes = useMemo(() => {
    if (!selectedFile?.attachments?.length) return [];
    return selectedFile.attachments
      .map((a, idx) => ({ a, idx }))
      .filter(({ a }) => (a || "").toLowerCase().endsWith(".pdf"));
  }, [selectedFile]);

  const openAction = (file, type) => {
    setSelectedFile(file);
    setActionModal({ open: true, type });
    setRemarks("");
    setProcessing(false);
    setSignPayload(null);

    // Default to first PDF
    const firstPdfIdx = (file.attachments || []).findIndex((a) => 
      (a || "").toLowerCase().endsWith(".pdf")
    );
    setSignAttachmentIndex(firstPdfIdx >= 0 ? firstPdfIdx : 0);
  };

  const closeAction = () => {
    setSelectedFile(null);
    setActionModal({ open: false, type: null });
    setRemarks("");
    setProcessing(false);
    setSignPayload(null);
    setSignOpen(false);
  };

  // ✅ Open signature modal
  const openSigner = () => {
    if (!selectedFile?.attachments?.length) {
      showToast("error", "No attachments found to sign.");
      return;
    }
    if (!pdfAttachmentIndexes.length) {
      showToast("error", "No PDF attachment available to sign.");
      return;
    }
    
    console.log('🖊️ Opening signer modal for attachment:', selectedFile.attachments[signAttachmentIndex]);
    setSignOpen(true);
  };

  // ✅ Handle signature applied
  const handleSignatureApplied = (payload) => {
    console.log('✅ Signature applied:', payload);
    setSignPayload(payload);
    setSignOpen(false);
    showToast("success", "Signature placed successfully");
  };

  const confirm = async () => {
    if (!selectedFile) return;

    const needsRemarks = actionModal.type === "REJECT" || actionModal.type === "REVISION";
    if (needsRemarks && !remarks.trim()) {
      showToast("error", "Remarks are required for this action");
      return;
    }

    // ✅ Require signature for all actions
    if (!signPayload?.signatureData || !signPayload?.signaturePlacement) {
      showToast("error", 'Please click "Open & Sign Document" to place your signature first.');
      return;
    }

    console.log('📤 Submitting action:', {
      type: actionModal.type,
      fileId: selectedFile._id,
      hasSignature: !!signPayload.signatureData,
      placement: signPayload.signaturePlacement
    });

    setProcessing(true);
    try {
      if (actionModal.type === "APPROVE") {
        await approveFile(
          selectedFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement
        );
      } else if (actionModal.type === "REJECT") {
        await rejectFile(
          selectedFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement
        );
      } else if (actionModal.type === "REVISION") {
        await requestRevision(
          selectedFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement
        );
      }

      showToast("success", `File ${actionModal.type.toLowerCase()} successfully`);
      closeAction();
      await fetchPendingFiles();
    } catch (e) {
      console.error('❌ Action failed:', e);
      showToast("error", e?.response?.data?.message || "Action failed");
      setProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading pending files..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Pending Actions
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Files currently assigned to your role for processing.
        </p>
      </div>

      {visiblePendingFiles.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="All caught up!"
          description="No pending files are assigned to you right now."
        />
      ) : (
        <div className="space-y-4">
          {visiblePendingFiles
            .slice()
            .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
            .map((file) => (
              <Card key={file._id} className="p-0 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0",
                            (file.priorityScore ?? 0) >= 67
                              ? "bg-gradient-to-br from-danger-500 to-danger-600"
                              : (file.priorityScore ?? 0) >= 34
                              ? "bg-gradient-to-br from-warning-500 to-warning-600"
                              : "bg-gradient-to-br from-success-500 to-success-600"
                          )}
                        >
                          <FileText className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                              {file.title}
                            </h3>
                            <Badge variant="secondary" size="sm">
                              {file.fileId}
                            </Badge>
                            {file.predictedDelay && (
                              <Badge variant="danger" size="sm">
                                Delay Risk
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                            <span>{file.fileType?.replaceAll("_", " ")}</span>
                            <span>•</span>
                            <span>Created {formatRelativeTime(file.createdAt)}</span>
                            <span>•</span>
                            <span>Step {file.currentStep}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge
                              variant={
                                (file.priorityScore ?? 0) >= 67
                                  ? "danger"
                                  : (file.priorityScore ?? 0) >= 34
                                  ? "warning"
                                  : "success"
                              }
                              size="sm"
                            >
                              Priority: {formatPriorityLabel(file.priorityScore || 0)} ({file.priorityScore || 0}/100)
                            </Badge>

                            <Badge variant="info" size="sm">
                              AI: {Math.round((file.aiConfidence || 0) * 100)}%
                            </Badge>

                            <Badge variant="secondary" size="sm">
                              SLA: {formatDateTime(file.slaDeadline)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {file.description && (
                        <p className="mt-3 text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                          {file.description}
                        </p>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:w-44">
                      <Button
                        variant="success"
                        size="sm"
                        fullWidth
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => openAction(file, "APPROVE")}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        leftIcon={<XCircle className="w-4 h-4" />}
                        onClick={() => openAction(file, "REJECT")}
                      >
                        Reject
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<AlertCircle className="w-4 h-4" />}
                        onClick={() => openAction(file, "REVISION")}
                      >
                        Revision
                      </Button>

                      <Link to={`/files/${file._id}`} className="w-full">
                        <Button variant="ghost" size="sm" fullWidth>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="h-1 bg-secondary-100 dark:bg-secondary-700">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      new Date(file.slaDeadline) < new Date()
                        ? "bg-danger-500"
                        : "bg-gradient-to-r from-primary-500 to-primary-600"
                    )}
                    style={{
                      width: `${Math.min(
                        100,
                        ((Date.now() - new Date(file.createdAt)) /
                          (new Date(file.slaDeadline) - new Date(file.createdAt))) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* ✅ Action Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={closeAction}
        size="lg"
        title={
          actionModal.type === "APPROVE"
            ? "Approve File"
            : actionModal.type === "REJECT"
            ? "Reject File"
            : "Request Revision"
        }
        footer={
          <>
            <Button variant="ghost" onClick={closeAction} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant={
                actionModal.type === "APPROVE"
                  ? "success"
                  : actionModal.type === "REJECT"
                  ? "danger"
                  : "warning"
              }
              isLoading={processing}
              onClick={confirm}
            >
              Confirm {actionModal.type}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* File Info */}
          <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700">
            <p className="text-sm font-semibold text-secondary-900 dark:text-white">
              {selectedFile?.title}
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              {selectedFile?.fileId}
            </p>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Remarks {actionModal.type === "APPROVE" ? "(Optional)" : "*"}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={
                actionModal.type === "APPROVE"
                  ? "Optional comments..."
                  : actionModal.type === "REJECT"
                  ? "Reason for rejection..."
                  : "What needs to be revised..."
              }
            />
          </div>

          {/* ✅ Signature Section */}
          <div className="p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Digital Signature Required
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                  You must sign the document before confirming this action
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<PenTool className="w-4 h-4" />}
                onClick={openSigner}
              >
                Open & Sign Document
              </Button>
            </div>

            {/* Signature Status */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={signPayload ? "success" : "warning"} 
                size="sm"
                leftIcon={signPayload ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              >
                {signPayload ? "✓ Signature Ready" : "⚠ Not Signed Yet"}
              </Badge>

              {/* PDF Selector (if multiple PDFs) */}
              {pdfAttachmentIndexes.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-600 dark:text-secondary-400">Sign PDF:</span>
                  <select
                    value={signAttachmentIndex}
                    onChange={(e) => {
                      setSignAttachmentIndex(Number(e.target.value));
                      setSignPayload(null); // Reset signature when changing PDF
                    }}
                    className="px-3 py-1.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-xs"
                  >
                    {pdfAttachmentIndexes.map(({ idx, a }) => (
                      <option key={idx} value={idx}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* ✅ Signature Modal */}
      {selectedFile && pdfAttachmentIndexes.length > 0 && (
        <DocumentSignerModal
          open={signOpen}
          onClose={() => setSignOpen(false)}
          attachmentIndex={signAttachmentIndex}
          pdfUrl={getUploadUrl(selectedFile.attachments[signAttachmentIndex], true)}
          onApply={handleSignatureApplied}
        />
      )}
    </div>
  );
}