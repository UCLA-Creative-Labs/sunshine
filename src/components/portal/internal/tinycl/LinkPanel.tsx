'use client';

import { useState, useEffect, useRef } from 'react';
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

function stripLeadingSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1) : value;
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
  const [slugEdited, setSlugEdited] = useState(false);

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
        setSlugEdited(true);
      } else {
        setDisplayName('');
        setUrl('');
        setRedirectPath('');
        setSlugEdited(false);
      }
    }
  }, [isOpen, editingLink]);

  useEffect(() => {
    if (!slugEdited && !editingLink) {
      setRedirectPath(toSlug(displayName));
    }
  }, [displayName, slugEdited, editingLink]);

  if (!isOpen) return null;

  const handleRedirectPathBlur = async () => {
    if (!redirectPath) return;
    
    if (editingLink && editingLink.redirect_path === redirectPath) {
      setSlugError('');
      return;
    }

    const taken = await isRedirectPathTaken(redirectPath);
    if (taken) {
      setSlugError('This redirect path is already taken.');
    } else {
      setSlugError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) return;
    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://...)');
      return;
    }
    if (slugError) return;
    if (!redirectPath) {
      setSlugError('Redirect path is required.');
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
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err?.message ?? 'Failed to save link. Please try again.');
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
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* URL */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              URL <span className="text-red-400">*</span>
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

          {/* Redirect Path */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Redirect Path <span className="text-red-400">*</span>
            </label>
            <div className={`flex items-center bg-gray-50 border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all ${
              slugError ? 'border-red-400' : 'border-gray-200'
            }`}>
              <span className="px-3 py-3 bg-gray-100 text-gray-400 text-sm font-medium border-right border-gray-200 select-none">
                tinycl.com/
              </span>
              <input
                required
                value={redirectPath}
                onChange={(e) => {
                  setRedirectPath(stripLeadingSlash(e.target.value));
                  setSlugEdited(true);
                  setSlugError('');
                }}
                onBlur={handleRedirectPathBlur}
                placeholder="slug-here"
                className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-gray-900"
              />
            </div>
            {slugError && <p className="text-xs text-red-500 font-medium">{slugError}</p>}
            <p className="text-[11px] text-gray-400 font-medium">Must be a unique, lowercase-kebab slug.</p>
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
