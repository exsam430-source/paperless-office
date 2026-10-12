import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Trash2, Pen, Sparkles } from 'lucide-react';

export default function SignatureCanvas({ onChange }) {
  const sigPadRef = useRef(null);

  const clear = () => {
    sigPadRef.current?.clear();
    onChange?.('');
  };

  const handleEnd = () => {
    if (sigPadRef.current?.isEmpty()) {
      onChange?.('');
      return;
    }

    const canvas = sigPadRef.current.getTrimmedCanvas();
    
    // Compress
    const maxWidth = 400;
    const maxHeight = 200;
    const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height, 1);
    
    const compressedCanvas = document.createElement('canvas');
    compressedCanvas.width = canvas.width * scale;
    compressedCanvas.height = canvas.height * scale;
    
    const ctx = compressedCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, compressedCanvas.width, compressedCanvas.height);
    
    const dataUrl = compressedCanvas.toDataURL('image/png', 0.8);
    
    console.log('📝 Signature size:', Math.round(dataUrl.length / 1024), 'KB');
    
    onChange?.(dataUrl);
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      
      <div className="relative border-3 border-dashed border-indigo-500/30 dark:border-indigo-400/30 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-strong">
            <Pen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Sign Here
            </span>
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* Canvas */}
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{
            className: 'w-full h-56 cursor-crosshair',
          }}
          onEnd={handleEnd}
          penColor="#4f46e5"
        />

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-t-2 border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Draw your signature above
          </p>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3 font-semibold">
        💡 Tip: Use a stylus or your finger for best results
      </p>
    </div>
  );
}