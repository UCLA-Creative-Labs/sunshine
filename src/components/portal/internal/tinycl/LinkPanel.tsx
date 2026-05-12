'use client';

import { useState, useEffect } from 'react';
import { createLink, updateLink, isRedirectPathTaken, Link } from '@/lib/supabase/linksService';
import { createClient } from '@/lib/supabase/client';
import { IoClose } from 'react-icons/io5';

interface LinkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingLink?: Link;
}

// --- Helpers ---

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}



function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function LinkPanel({ isOpen, onClose, onSubmit, editingLink }: LinkPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [url, setUrl] = useState('');
  const [redirectPath, setRedirectPath] = useState('');

  // Validation state
  const [urlError, setUrlError] = useState('');
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setUrlError('');
      setSlugError('');
      if (editingLink) {
        setDisplayName(editingLink.display_name);
        setUrl(editingLink.url);
        setRedirectPath(editingLink.redirect_path);
      } else {
        setDisplayName('');
        setUrl('');
        setRedirectPath('');
      }
    }
  }, [isOpen, editingLink]);

  useEffect(() => {
    const slug = toSlug(displayName);
    setRedirectPath(slug);
    
    // Clear slug error when name changes
    if (slugError) setSlugError('');
  }, [displayName]);

  if (!isOpen) return null;

  const validateSlug = async () => {
    if (!redirectPath) return true;
    
    if (editingLink && editingLink.redirect_path === redirectPath) {
      return true;
    }

    const taken = await isRedirectPathTaken(redirectPath);
    if (taken) {
      setSlugError('A link with this name already exists.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) return;
    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://...)');
      return;
    }

    const isSlugValid = await validateSlug();
    if (!isSlugValid) return;

    if (!redirectPath) {
      setSlugError('A valid display name is required to generate a link.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const payload = {
        display_name: displayName.trim(),
        url: url.trim(),
        redirect_path: redirectPath,
      };

      if (editingLink) {
        await updateLink(editingLink.id, payload);
      } else {
        await createLink({
          ...payload,
          created_by: user?.id ?? null,
        });
      }

      onSubmit();
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError((err as Error)?.message ?? 'Failed to save link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {editingLink ? 'Edit Link' : 'New Link'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Display Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. S26 Project Member Application"
              className={`px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                slugError ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {slugError && <p className="text-xs text-red-500 font-medium">{slugError}</p>}
            
            {/* URL Preview */}
            {displayName && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 w-fit">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-tight">URL Preview:</span>
                <span className="text-xs font-medium text-blue-700">tinycl.com/{redirectPath}</span>
              </div>
            )}
          </div>

          {/* URL */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Destination URL <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
              onBlur={() => { if (url && !isValidUrl(url)) setUrlError('Invalid URL'); }}
              placeholder="https://forms.gle/abc123"
              className={`px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                urlError ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {urlError && <p className="text-xs text-red-500 font-medium">{urlError}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
            >
              {loading ? 'Saving...' : editingLink ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
