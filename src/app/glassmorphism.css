import { Download, Palette, Camera, RotateCcw } from 'lucide-react';

interface ActionBarProps {
  onDownload: () => void;
  onSave: () => void;
  onShare: () => void;
  onRandomize: () => void;
  onReset: () => void;
  onToggleStock: () => void;
  showStock: boolean;
}

export function ActionBar({
  onDownload,
  onSave,
  onShare,
  onRandomize,
  onReset,
  onToggleStock,
  showStock
}: ActionBarProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 z-20 flex-wrap">
      {/* Primary Actions */}
      <button
        onClick={onDownload}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold flex items-center gap-2 transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">Export HD</span>
      </button>

      {/* Stock Toggle */}
      <button
        onClick={onToggleStock}
        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all border-2 ${
          showStock
            ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
            : 'bg-black/60 backdrop-blur-md border-gray-700 hover:bg-black/80'
        }`}
      >
        <span className="hidden sm:inline">{showStock ? '✨ Custom' : '📦 Stock'}</span>
        <span className="sm:hidden">{showStock ? '✨' : '📦'}</span>
      </button>

      {/* Save & Share */}
      <button
        onClick={onSave}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-all shadow-lg"
      >
        💾 <span className="hidden sm:inline">Save</span>
      </button>

      <button
        onClick={onShare}
        className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold transition-all shadow-lg"
      >
        🔗 <span className="hidden sm:inline">Share</span>
      </button>

      {/* Utilities */}
      <button
        onClick={onRandomize}
        className="px-6 py-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 font-semibold flex items-center gap-2 transition-all border border-gray-700"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden sm:inline">Random</span>
      </button>

      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 font-semibold transition-all border border-gray-700"
      >
        <RotateCcw className="w-4 h-4 sm:hidden" />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
}