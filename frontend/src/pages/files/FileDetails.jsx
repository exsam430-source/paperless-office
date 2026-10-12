import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Clock,
  Building2,
  User,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
  PenTool,
  FileText,
  Eye,
} from "lucide-react";

import { useAuth } from "@hooks/useAuth";
import { useFiles } from "@hooks/useFiles";
import { useNotifications } from "@hooks/useNotifications";

import Card from "@components/common/Card";
import Badge from "@components/common/Badge";
import Button from "@components/common/Button";
import Modal from "@components/common/Modal";
import LoadingSpinner from "@components/common/LoadingSpinner";

import FileTimeline from "@components/files/FileTimeline";
import PdfPreviewModal from "@components/files/PdfPreviewModal";
import DocumentSignerModal from "@components/files/DocumentSignerModal";

import { getUploadUrl } from "@utils/fileUrls";
import { formatDateTime, formatPriorityLabel } from "@utils/formatters";

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const {
    currentFile,
    fetchFileById,
    approveFile,
    rejectFile,
    requestRevision,
    clearCurrentFile,
    isLoading,
  } = useFiles();

  const [preview, setPreview] = useState({ open: false, url: "", name: "" });
  const [refreshKey, setRefreshKey] = useState(0); // ✅ Track refreshes

  const [actionModal, setActionModal] = useState({ open: false, type: null });
  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);

  // Signature state
  const [signOpen, setSignOpen] = useState(false);
  const [signAttachmentIndex, setSignAttachmentIndex] = useState(0);
  const [signPayload, setSignPayload] = useState(null);

  // ✅ Check if current user is the creator
  const isCreator = useMemo(() => {
    if (!currentFile || !user) return false;
    const creatorId = currentFile.createdBy?._id || currentFile.createdBy?.id;
    const userId = user.id || user._id;
    return String(creatorId) === String(userId);
  }, [currentFile, user]);

  // ✅ Listen for real-time updates
  useEffect(() => {
    const handler = async (e) => {
      const data = e.detail;

      if (!currentFile?.fileId) return;
      if (data?.fileId !== currentFile.fileId && data?._id !== currentFile._id) return;

      console.log('🔄 File updated via socket, refreshing...', data);

      // Refetch to get updated attachments
      await fetchFileById(id);
      
      // Force component refresh
      setRefreshKey(prev => prev + 1);

      // Close preview to avoid showing stale PDF
      setPreview({ open: false, url: "", name: "" });

      showToast("info", "File has been updated");
    };

    window.addEventListener("po:fileUpdated", handler);
    return () => window.removeEventListener("po:fileUpdated", handler);
  }, [currentFile?.fileId, currentFile?._id, id, fetchFileById, showToast]);

  // ✅ Initial fetch
  useEffect(() => {
    (async () => {
      try {
        await fetchFileById(id);
      } catch (e) {
        showToast("error", "Failed to load file");
        navigate("/my-files");
      }
    })();

    return () => clearCurrentFile();
  }, [id]);

  // ✅ PDF attachments for signing
  const pdfAttachmentIndexes = useMemo(() => {
    if (!currentFile?.attachments?.length) return [];
    return currentFile.attachments
      .map((a, idx) => ({ a, idx }))
      .filter(({ a }) => (a || "").toLowerCase().endsWith(".pdf"));
  }, [currentFile]);

  const openAction = (type) => {
    setActionModal({ open: true, type });
    setRemarks("");
    setProcessing(false);
    setSignPayload(null);

    // Default to first PDF
    if (pdfAttachmentIndexes.length > 0) {
      setSignAttachmentIndex(pdfAttachmentIndexes[0].idx);
    }
  };

  const closeAction = () => {
    setActionModal({ open: false, type: null });
    setRemarks("");
    setProcessing(false);
    setSignPayload(null);
    setSignOpen(false);
  };

  const openSigner = () => {
    if (!pdfAttachmentIndexes.length) {
      showToast("error", "No PDF attachment available to sign.");
      return;
    }
    setSignOpen(true);
  };

  // ✅ Open PDF preview
  const openPdfPreview = (attachment) => {
    setPreview({
      open: true,
      url: getUploadUrl(attachment, true), // Cache-busting enabled
      name: attachment,
    });
  };

  // ✅ Download file
  const downloadFile = (attachment) => {
    const url = getUploadUrl(attachment, false);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment;
    link.click();
  };

  const confirm = async () => {
    if (!currentFile) return;

    const needsRemarks = actionModal.type === "REJECT" || actionModal.type === "REVISION";
    if (needsRemarks && !remarks.trim()) {
      showToast("error", "Remarks are required for this action");
      return;
    }

    // ✅ Require signature
    if (!signPayload?.signatureData || !signPayload?.signaturePlacement) {
      showToast("error", "Please Open & Sign the PDF before confirming.");
      return;
    }

    setProcessing(true);
    try {
      if (actionModal.type === "APPROVE") {
        await approveFile(
          currentFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement,
        );
      } else if (actionModal.type === "REJECT") {
        await rejectFile(
          currentFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement,
        );
      } else if (actionModal.type === "REVISION") {
        await requestRevision(
          currentFile._id,
          remarks,
          signPayload.signatureData,
          signPayload.signaturePlacement,
        );
      }

      showToast("success", "Action completed successfully");
      closeAction();

      // Refetch to show updated signed PDF
      await fetchFileById(id);
      setRefreshKey(prev => prev + 1);
    } catch (e) {
      console.error('❌ Action failed:', e);
      showToast("error", e?.response?.data?.message || "Action failed");
      setProcessing(false);
    }
  };

  if (isLoading || !currentFile) {
    return <LoadingSpinner fullScreen text="Loading file..." />;
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back
          </Button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
              {currentFile.title}
            </h1>
            <Badge variant="secondary">{currentFile.fileId}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                currentFile.status === "APPROVED"
                  ? "success"
                  : currentFile.status === "REJECTED"
                    ? "danger"
                    : currentFile.status === "ESCALATED"
                      ? "danger"
                      : currentFile.status === "REVISION"
                        ? "info"
                        : "warning"
              }
            >
              {currentFile.status}
            </Badge>

            <Badge
              variant={
                (currentFile.priorityScore ?? 0) >= 67
                  ? "danger"
                  : (currentFile.priorityScore ?? 0) >= 34
                    ? "warning"
                    : "success"
              }
            >
              {formatPriorityLabel(currentFile.priorityScore || 0)} Priority (
              {currentFile.priorityScore || 0}/100)
            </Badge>

            {currentFile.predictedDelay && (
              <Badge variant="danger">
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Delay Risk
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Action Banner */}
      {currentFile?.status === "PENDING" &&
        currentFile?.currentHolderRole === user?.role && (
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
                  {isCreator ? "Submitted Successfully" : "Action Required"}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {isCreator
                    ? `You created this file. It is waiting for another ${user?.role} officer to act (self-approval disabled).`
                    : `This file is currently assigned to your role: ${user?.role}.`}
                </p>
              </div>

              {!isCreator && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => openAction("APPROVE")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={() => openAction("REJECT")}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => openAction("REVISION")}
                  >
                    Revision
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Description
            </h3>
            <p className="text-secondary-700 dark:text-secondary-300 whitespace-pre-wrap">
              {currentFile.description || "No description provided."}
            </p>
          </Card>

          {/* ✅ Attachments - Fixed */}
          {currentFile.attachments && currentFile.attachments.length > 0 && (
            <Card key={`attachments-${refreshKey}-${currentFile.updatedAt}`}>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Attachments ({currentFile.attachments.length})
              </h3>

              <div className="space-y-3">
                {currentFile.attachments.map((attachment, index) => (
                  <div
                    key={`${attachment}-${index}-${currentFile.updatedAt}-${refreshKey}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                          {attachment}
                        </p>
                        {attachment.includes('SIGNED') && (
                          <Badge variant="success" size="sm" className="mt-1">
                            ✓ Digitally Signed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {attachment.toLowerCase().endsWith('.pdf') && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="w-4 h-4" />}
                          onClick={() => openPdfPreview(attachment)}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={() => downloadFile(attachment)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
              Workflow Timeline
            </h3>
            <FileTimeline history={currentFile.history || []} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              File Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Created by
                  </p>
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {currentFile.createdBy?.name}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {currentFile.createdBy?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {currentFile.department?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    SLA Deadline
                  </p>
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {formatDateTime(currentFile.slaDeadline)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Current Holder
                  </p>
                  <Badge variant="primary" size="sm">
                    {currentFile.currentHolderRole}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Modal */}
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

          {/* Sign Section */}
          <div className="p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Digital Signature Required
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                  You must sign the document before confirming
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<PenTool className="w-4 h-4" />}
                onClick={openSigner}
              >
                Open & Sign
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={signPayload ? "success" : "warning"} 
                size="sm"
                leftIcon={signPayload ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              >
                {signPayload ? "✓ Signature Ready" : "⚠ Not Signed Yet"}
              </Badge>

              {pdfAttachmentIndexes.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-600 dark:text-secondary-400">
                    Sign PDF:
                  </span>
                  <select
                    value={signAttachmentIndex}
                    onChange={(e) => {
                      setSignAttachmentIndex(Number(e.target.value));
                      setSignPayload(null);
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

      {/* Signature Modal */}
      {pdfAttachmentIndexes.length > 0 && currentFile.attachments[signAttachmentIndex] && (
        <DocumentSignerModal
          open={signOpen}
          onClose={() => setSignOpen(false)}
          attachmentIndex={signAttachmentIndex}
          pdfUrl={getUploadUrl(currentFile.attachments[signAttachmentIndex], true)}
          onApply={(payload) => {
            setSignPayload(payload);
            setSignOpen(false);
            showToast("success", "Signature placed successfully");
          }}
        />
      )}

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={preview.open}
        onClose={() => setPreview({ open: false, url: "", name: "" })}
        url={preview.url}
        title={preview.name || "Preview"}
      />
    </div>
  );
}