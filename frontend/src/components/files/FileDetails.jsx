import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building2,
  Clock,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

import { useFiles } from "@hooks/useFiles";
import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";

import Card from "@components/common/Card";
import Badge from "@components/common/Badge";
import Button from "@components/common/Button";
import LoadingSpinner from "@components/common/LoadingSpinner";
import PdfPreviewModal from "@components/files/PdfPreviewModal";

import { getUploadUrl } from "@utils/fileUrls";
import {
  formatDateTime,
  formatRelativeTime,
  formatPriorityLabel,
} from "@utils/formatters";
import { cn } from "@utils/cn";

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const { currentFile, fetchFileById, isLoading, clearCurrentFile } =
    useFiles();

  const [pdfPreview, setPdfPreview] = useState({
    open: false,
    url: "",
    title: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchFileById(id);
    }

    return () => {
      clearCurrentFile();
    };
  }, [id]);

  // ✅ Listen for real-time updates from socket
  useEffect(() => {
    const handleFileUpdate = async (event) => {
      const data = event.detail || event;

      const currentFileId = currentFile?._id || currentFile?.id;
      const updatedFileId = data._id || data.fileId;

      if (
        currentFileId &&
        (currentFileId === updatedFileId || currentFile?.fileId === data.fileId)
      ) {
        console.log("🔄 File updated via socket, refreshing data...", data);

        await fetchFileById(id);
        setRefreshKey((prev) => prev + 1);

        showToast("info", "File has been updated");
      }
    };

    window.addEventListener("po:fileUpdated", handleFileUpdate);

    return () => {
      window.removeEventListener("po:fileUpdated", handleFileUpdate);
    };
  }, [
    id,
    currentFile?._id,
    currentFile?.id,
    currentFile?.fileId,
    fetchFileById,
  ]);

  // ✅ Open PDF with options (preview or new tab)
  const openPdfPreview = (attachment) => {
    const url = getUploadUrl(attachment, true);
    
    // Check if browser supports PDF preview
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isFirefox || isSafari) {
      // Show options for browsers with limited PDF support
      const userChoice = window.confirm(
        `PDF preview may not work in ${isFirefox ? 'Firefox' : 'Safari'}.\n\n` +
        `Click "OK" to open in new tab, or "Cancel" to download.`
      );
      
      if (userChoice) {
        // Open in new tab
        window.open(url, '_blank');
      } else {
        // Download
        downloadFile(attachment);
      }
    } else {
      // Chrome/Edge - use modal preview
      setPdfPreview({
        open: true,
        url: url,
        title: attachment,
      });
    }
  };

  const downloadFile = (attachment) => {
    const url = getUploadUrl(attachment, false);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Open PDF in new tab
  const openInNewTab = (attachment) => {
    const url = getUploadUrl(attachment, true);
    window.open(url, '_blank');
  };

  if (isLoading && !currentFile) {
    return <LoadingSpinner fullScreen text="Loading file details..." />;
  }

  if (!currentFile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
          File not found
        </h3>
        <Button variant="primary" onClick={() => navigate("/files")}>
          Back to Files
        </Button>
      </div>
    );
  }

  const file = currentFile;

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5" />;
      case "REVISION":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      case "REVISION":
        return "warning";
      case "ESCALATED":
        return "danger";
      default:
        return "info";
    }
  };

  const canTakeAction =
    file.status === "PENDING" &&
    file.currentHolderRole === user?.role &&
    file.createdBy?._id !== user?.id &&
    file.createdBy?._id !== user?._id;

  return (
    <div className="max-w-6xl mx-auto space-y-6" key={refreshKey}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
              {file.title}
            </h1>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {file.fileId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={getStatusColor(file.status)}
            leftIcon={getStatusIcon(file.status)}
          >
            {file.status}
          </Badge>
        </div>
      </div>

      {/* Main Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Department
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {file.department?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  File Type
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {file.fileType?.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Created By
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {file.createdBy?.name} ({file.createdBy?.role})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Created
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {formatDateTime(file.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  SLA Deadline
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {formatDateTime(file.slaDeadline)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Current Holder
                </p>
                <p className="text-base text-secondary-900 dark:text-white">
                  {file.currentHolderRole}
                </p>
              </div>
            </div>
          </div>
        </div>

        {file.description && (
          <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Description
            </p>
            <p className="text-base text-secondary-900 dark:text-white">
              {file.description}
            </p>
          </div>
        )}
      </Card>

      {/* AI Predictions */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          AI Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              Priority Score
            </p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {file.priorityScore || 0}/100
            </p>
            <Badge
              variant={
                (file.priorityScore || 0) >= 67
                  ? "danger"
                  : (file.priorityScore || 0) >= 34
                    ? "warning"
                    : "success"
              }
              size="sm"
              className="mt-2"
            >
              {formatPriorityLabel(file.priorityScore || 0)}
            </Badge>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              Delay Prediction
            </p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {file.predictedDelay ? "Yes" : "No"}
            </p>
            <Badge
              variant={file.predictedDelay ? "danger" : "success"}
              size="sm"
              className="mt-2"
            >
              {file.predictedDelay ? "Risk Detected" : "On Track"}
            </Badge>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              AI Confidence
            </p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {Math.round((file.aiConfidence || 0) * 100)}%
            </p>
            <Badge variant="info" size="sm" className="mt-2">
              Confidence Level
            </Badge>
          </div>
        </div>
      </Card>

      {/* ✅ Attachments - Updated with multiple viewing options */}
      {file.attachments && file.attachments.length > 0 && (
        <Card key={`attachments-${refreshKey}`}>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Attachments
          </h3>
          <div className="space-y-3">
            {file.attachments.map((attachment, index) => (
              <div
                key={`${attachment}-${index}-${refreshKey}`}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                      {attachment}
                    </p>
                    {attachment.includes("SIGNED") && (
                      <Badge variant="success" size="sm" className="mt-1">
                        ✓ Digitally Signed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {attachment.toLowerCase().endsWith(".pdf") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                        onClick={() => openPdfPreview(attachment)}
                        title="Preview PDF"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                        onClick={() => openInNewTab(attachment)}
                        title="Open in new tab"
                      >
                        Open
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => downloadFile(attachment)}
                    title="Download file"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History */}
      {file.history && file.history.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Workflow History
          </h3>
          <div className="space-y-4">
            {file.history.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      entry.action === "APPROVED"
                        ? "bg-success-100 dark:bg-success-900/20"
                        : entry.action === "REJECTED"
                          ? "bg-danger-100 dark:bg-danger-900/20"
                          : entry.action === "REVISION"
                            ? "bg-warning-100 dark:bg-warning-900/20"
                            : "bg-secondary-100 dark:bg-secondary-800",
                    )}
                  >
                    {getStatusIcon(entry.action)}
                  </div>
                  {index < file.history.length - 1 && (
                    <div className="w-0.5 h-full bg-secondary-200 dark:bg-secondary-700 my-2" />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={getStatusColor(entry.action)} size="sm">
                      {entry.action}
                    </Badge>
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      by {entry.userId?.name || "Unknown"} ({entry.role})
                    </span>
                    {entry.signatureHash && (
                      <Badge variant="success" size="sm">
                        ✓ Signed
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                    {formatDateTime(entry.timestamp)}
                  </p>
                  {entry.remarks && (
                    <p className="text-sm text-secondary-700 dark:text-secondary-300 italic">
                      "{entry.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      {canTakeAction && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/files/pending`} className="flex-1">
              <Button variant="primary" fullWidth>
                Take Action
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={pdfPreview.open}
        onClose={() => setPdfPreview({ open: false, url: "", title: "" })}
        url={pdfPreview.url}
        title={pdfPreview.title}
      />
    </div>
  );
}