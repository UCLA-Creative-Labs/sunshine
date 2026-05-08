'use client';

import { useState, useEffect } from 'react';
import { getLinks, deleteLink, Link } from '@/lib/supabase/linksService';
import LinkBoard from '@/components/portal/internal/tinycl/LinkBoard';
import LinkPanel from '@/components/portal/internal/tinycl/LinkPanel';

export default function TinyCLPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | undefined>();

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await getLinks();
      setLinks(data);
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleAddNew = () => {
    setEditingLink(undefined);
    setIsPanelOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsPanelOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
      await loadLinks();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete link. Check if you have internal member permissions.');
    }
  };

  const handleFormSubmit = () => {
    loadLinks();
    setIsPanelOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header row — matches Design/Projects page */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">TinyCL</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          New +
        </button>
      </div>


      {/* Board component containing the list and "Add New" trigger */}
      <LinkBoard
        links={links}
        loading={loading}
        onEditLink={handleEditLink}
        onDeleteLink={handleDeleteLink}
        onAddNew={handleAddNew}
      />

      {/* Slide-over panel for Create/Update actions */}
      <LinkPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleFormSubmit}
        editingLink={editingLink}
      />
    </div>
  );
}
