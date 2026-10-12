import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import SignatureCanvas from '@components/files/SignatureCanvas';
import { Document, Page, pdfjs } from 'react-pdf';
import { Move, UploadCloud, Trash2, ChevronLeft, ChevronRight, Sparkles, FileText, Crosshair } from 'lucide-react';
import { cn } from '@utils/cn';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DocumentSignerModal({
  open,
  onClose,
  pdfUrl,
  attachmentIndex = 0,
  onApply
}) {
  const containerRef = useRef(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [sigPos, setSigPos] = useState({ x: 40, y: 40 });
  const [sigWidth, setSigWidth] = useState(160);

  const sigHeight = useMemo(() => Math.round(sigWidth * 0.45), [sigWidth]);

  useEffect(() => {
    if (!open) return;
    setPageNumber(1);
    setSigPos({ x: 40, y: 40 });
    setSigWidth(160);
  }, [open]);

  const onDocLoad = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleUploadSignature = (file) => {
    if (!file) return;

    if (file.type !== 'image/png') {
      alert('Only PNG signature is allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('PNG must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 400;
        const maxHeight = 200;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/png', 0.8);
        console.log('📤 Compressed signature:', Math.round(compressedDataUrl.length / 1024), 'KB');
        setSignatureData(compressedDataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    setSignatureData('');
  };

  const startDrag = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const init = { ...sigPos };

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const rect = containerRef.current?.getBoundingClientRect();
      const maxX = rect ? Math.max(0, rect.width - sigWidth) : Infinity;
      const maxY = rect ? Math.max(0, rect.height - sigHeight) : Infinity;

      setSigPos({
        x: Math.max(0, Math.min(maxX, init.x + dx)),
        y: Math.max(0, Math.min(maxY, init.y + dy)),
      });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const apply = () => {
    if (!signatureData) {
      alert('Please draw or upload a signature first.');
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;

    const xPct = sigPos.x / containerW;
    const yPct = (containerH - (sigPos.y + sigHeight)) / containerH;
    const wPct = sigWidth / containerW;

    console.log('✅ Applying signature:', {
      attachmentIndex,
      pageNumber,
      xPct,
      yPct,
      wPct,
      signatureSize: Math.round(signatureData.length / 1024) + 'KB'
    });

    onApply?.({
      signatureData,
      signaturePlacement: {
        attachmentIndex,
        pageNumber,
        xPct,
        yPct,
        wPct
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="2xl"
      title="Digital Document Signing"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={apply} 
            disabled={!signatureData}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Apply Signature
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== LEFT: Signature Area ===== */}
        <div className="space-y-4">
          <Card variant="gradient" className="p-0">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      Your Signature
                    </p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Draw or upload PNG
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-indigo-500/30 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-105">
                    <UploadCloud className="w-4 h-4" />
                    Upload PNG
                    <input
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={(e) => handleUploadSignature(e.target.files?.[0])}
                    />
                  </label>

                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={clearSignature}
                    disabled={!signatureData}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <SignatureCanvas onChange={setSignatureData} />

              {/* Size Slider */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  📏 Signature Size: {sigWidth}px
                </label>
                <input
                  type="range"
                  min={120}
                  max={280}
                  value={sigWidth}
                  onChange={(e) => setSigWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${((sigWidth - 120) / 160) * 100}%, #e2e8f0 ${((sigWidth - 120) / 160) * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Crosshair className="w-4 h-4" />
                  Drag signature on PDF preview to position →
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ===== RIGHT: PDF Viewer ===== */}
        <div className="space-y-4">
          <Card variant="gradient" className="p-0">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      Document Preview
                    </p>
                    <Badge variant="secondary" size="sm">
                      Page {pageNumber} / {numPages || '-'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
                    disabled={!numPages || pageNumber >= numPages}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* PDF Container */}
              <div
                ref={containerRef}
                className="relative w-full rounded-2xl overflow-hidden border-3 border-slate-200/60 dark:border-slate-700/60 bg-white shadow-2xl"
              >
                <Document file={pdfUrl} onLoadSuccess={onDocLoad}>
                  <Page
                    pageNumber={pageNumber}
                    width={520}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>

                {/* Signature Overlay */}
                {signatureData && (
                  <div
                    className="absolute select-none cursor-move border-3 border-dashed border-indigo-500 rounded-lg overflow-hidden group"
                    style={{
                      left: sigPos.x,
                      top: sigPos.y,
                      width: sigWidth,
                      height: sigHeight
                    }}
                    onPointerDown={startDrag}
                    title="Drag to reposition"
                  >
                    {/* Drag handle */}
                    <div className="absolute -top-10 left-0 right-0 flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-xl shadow-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <Move className="w-4 h-4" />
                      Drag to Position
                    </div>

                    {/* Signature image */}
                    <img
                      src={signatureData}
                      alt="signature"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      draggable={false}
                      className="bg-white/90 backdrop-blur-sm"
                    />

                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-3 h-3 bg-indigo-500 rounded-br-lg" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-indigo-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 rounded-tl-lg" />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className={cn(
                'p-4 rounded-2xl text-center border-2 backdrop-blur-sm transition-all duration-300',
                signatureData 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/30' 
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500/30'
              )}>
                <p className={cn(
                  'text-sm font-bold',
                  signatureData 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-amber-700 dark:text-amber-300'
                )}>
                  {signatureData 
                    ? '✓ Signature ready - drag to position on document' 
                    : '← Draw or upload signature first'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
}