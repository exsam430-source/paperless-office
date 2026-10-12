import React, { useState, useEffect } from 'react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import { AlertCircle, ExternalLink, Download } from 'lucide-react';

export default function PdfPreviewModal({ open, onClose, url, title = 'PDF Preview' }) {
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (open) {
      setIframeKey(prev => prev + 1);
      setLoadError(false);
    }
  }, [open, url]);

  // ✅ Detect iframe load errors
  const handleIframeError = () => {
    setLoadError(true);
  };

  // ✅ Open in new tab
  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  // ✅ Download file
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={title} size="2xl" footer={null}>
      <div className="space-y-4">
        {/* ✅ Error message with fallback options */}
        {loadError && (
          <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-warning-800 dark:text-warning-300 mb-1">
                  Preview Not Available
                </h4>
                <p className="text-sm text-warning-700 dark:text-warning-400 mb-3">
                  Your browser blocked the PDF preview. Please use one of the options below:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={openInNewTab}
                  >
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={downloadFile}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ PDF Preview */}
        <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
          {!loadError && (
            <iframe
              key={iframeKey}
              src={url}
              title="PDF Preview"
              className="w-full h-full"
              onError={handleIframeError}
              onLoad={(e) => {
                // ✅ Check if iframe content is accessible
                try {
                  const iframeDoc = e.target.contentDocument || e.target.contentWindow?.document;
                  if (!iframeDoc) {
                    setLoadError(true);
                  }
                } catch (err) {
                  // Cross-origin or blocked
                  console.warn('PDF preview blocked:', err);
                  setLoadError(true);
                }
              }}
            />
          )}
          
          {loadError && (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary-500 dark:text-secondary-400">
                Unable to display preview
              </p>
            </div>
          )}
        </div>

        {/* ✅ Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            leftIcon={<ExternalLink className="w-4 h-4" />}
            onClick={openInNewTab}
          >
            Open in New Tab
          </Button>
        </div>
      </div>
    </Modal>
  );
}