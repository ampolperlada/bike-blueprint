'use client';

import { useEffect } from 'react';

interface KeyboardShortcutCallbacks {
  onExport?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onRandomize?: () => void;
  onShare?: () => void;
  onToggleAutoRotate?: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardShortcutCallbacks) {
  useEffect(() => {
    // Add CSS animations (only on client-side)
    const styleId = 'keyboard-shortcuts-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + E = Export
      if (modKey && e.key === 'e') {
        e.preventDefault();
        callbacks.onExport?.();
        showToast('Exporting image...');
      }

      // Ctrl/Cmd + S = Save
      if (modKey && e.key === 's') {
        e.preventDefault();
        callbacks.onSave?.();
        showToast('Build saved!');
      }

      // Ctrl/Cmd + Shift + S = Share
      if (modKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        callbacks.onShare?.();
        showToast('Share link copied!');
      }

      // R = Randomize colors
      if (e.key === 'r' && !modKey && !e.shiftKey) {
        callbacks.onRandomize?.();
        showToast('Colors randomized!');
      }

      // ESC = Reset to defaults
      if (e.key === 'Escape') {
        callbacks.onReset?.();
        showToast('Reset to defaults');
      }

      // Space = Toggle auto-rotate
      if (e.key === ' ' && !modKey) {
        e.preventDefault();
        callbacks.onToggleAutoRotate?.();
      }

      // ? = Show keyboard shortcuts help
      if (e.key === '?') {
        showShortcutsHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callbacks]);
}

// Simple toast notification
function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #252526;
    color: #CCCCCC;
    padding: 12px 20px;
    border-radius: 6px;
    border: 1px solid #3E3E42;
    font-size: 13px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Show shortcuts help modal
function showShortcutsHelp() {
  const existing = document.getElementById('shortcuts-modal');
  if (existing) {
    existing.remove();
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';
  modal.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    ">
      <div style="
        background: #252526;
        border: 1px solid #3E3E42;
        border-radius: 8px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
      ">
        <h2 style="color: #CCCCCC; margin: 0 0 20px; font-size: 18px;">
          Keyboard Shortcuts
        </h2>
        <div style="color: #CCCCCC; font-size: 13px; line-height: 1.8;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Export Image</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">Ctrl/⌘ E</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Save Build</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">Ctrl/⌘ S</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Share Build</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">Ctrl/⌘ Shift S</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Randomize Colors</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">R</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Reset to Defaults</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">ESC</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #808080;">Toggle Auto-Rotate</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">Space</kbd>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #808080;">Show This Help</span>
            <kbd style="background: #1E1E1E; padding: 4px 8px; border-radius: 4px; border: 1px solid #3E3E42;">?</kbd>
          </div>
        </div>
        <button onclick="this.closest('#shortcuts-modal').remove()" style="
          margin-top: 20px;
          width: 100%;
          padding: 8px;
          background: #007ACC;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        ">
          Got it!
        </button>
      </div>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}