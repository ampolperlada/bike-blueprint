import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-black/40 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              MotoPH Professional Studio
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              3D Motorcycle Customization Platform
            </p>
          </div>
          <button
            onClick={onSettingsClick}
            className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Settings & Debug"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}