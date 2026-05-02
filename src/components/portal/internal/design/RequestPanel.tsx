'use client';

import { useState, useEffect, useRef } from 'react';
import { createDesignRequest, updateDesignRequest } from '@/lib/supabase/designRequestService';
import {
  Committee,
  Publicity,
  Urgency,
  DesignRequest,
} from '@/types/designRequest';
import { getCurrentQuarter, getAllQuarters } from '@/lib/utils/quarterService';
import { getCurrentUserId } from '@/lib/supabase/profileService';
import { IoClose } from 'react-icons/io5';

const COMMITTEES: Committee[] = ['Marketing', 'Projects', 'Tech', 'Finance'];
const GRAPHIC_TYPES = [
  'Instagram Post (Single)',
  'Instagram Post (Multiple Slides)',
  'Instagram Asset',
  'Presentation Slides',
];
const PUBLICITY_OPTIONS: Publicity[] = ['External', 'Internal', 'Both'];
const URGENCY_OPTIONS: Urgency[] = ['Very urgent! 😵💫', 'Not urgent 😙'];
const QUARTERS = getAllQuarters('2026-03-21');

interface RequestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingRequest?: DesignRequest;
}

export default function RequestPanel({ isOpen, onClose, onSubmit, editingRequest }: RequestPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphicType, setGraphicType] = useState<string>('');
  const [isOtherGraphic, setIsOtherGraphic] = useState(false);
  const [otherGraphicValue, setOtherGraphicValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form state when panel opens/closes or editing target changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editingRequest) {
        const isCustomType = !GRAPHIC_TYPES.includes(editingRequest.graphic_type);
        setGraphicType(isCustomType ? 'Other' : editingRequest.graphic_type);
        setIsOtherGraphic(isCustomType);
        setOtherGraphicValue(isCustomType ? editingRequest.graphic_type : '');
      } else {
        setGraphicType('');
        setIsOtherGraphic(false);
        setOtherGraphicValue('');
      }
    }
  }, [isOpen, editingRequest]);

  if (!isOpen) return null;

  const handleGraphicTypeChange = (val: string) => {
    if (val === 'Other') {
      setIsOtherGraphic(true);
      setGraphicType('Other');
      setOtherGraphicValue('');
    } else {
      setIsOtherGraphic(false);
      setGraphicType(val);
      setOtherGraphicValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Determine the final graphic type value
    const finalGraphicType = isOtherGraphic
      ? otherGraphicValue.trim()
      : (formData.get('graphic_type') as string);

    if (!finalGraphicType) {
      setError('Please specify a type of graphic.');
      setLoading(false);
      return;
    }

    try {
      const userId = await getCurrentUserId().catch(() => null);

      const requestData: any = {
        name: formData.get('name') as string,
        title: (formData.get('title') as string) || (formData.get('name') as string), // fallback to name if title empty
        committee: formData.get('committee') as Committee,
        graphic_type: finalGraphicType,
        content: (formData.get('content') as string) || '',
        location: (formData.get('location') as string) || null,
        event_date: formData.get('event_date') ? new Date(formData.get('event_date') as string).toISOString() : null,
        due_date: formData.get('due_date') as string,
        publicity: formData.get('publicity') as Publicity,
        quarter: formData.get('quarter') as string,
        urgency: formData.get('urgency') as Urgency,
        notes: (formData.get('notes') as string) || null,
        created_by: userId,
      };

      if (editingRequest) {
        await updateDesignRequest(editingRequest.id, requestData);
      } else {
        await createDesignRequest(requestData);
      }

      formRef.current?.reset();
      onSubmit();
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err?.message ?? 'Failed to save request. Please try again.');
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

      {/* Panel — flush to right and full height */}
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {editingRequest ? 'Edit Request' : 'New Design Request'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Request Entry Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Request Entry Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              name="name"
              defaultValue={editingRequest?.name}
              placeholder="e.g. Workshop Promotion"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Title (optional) */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Graphic Title</label>
            <input
              name="title"
              defaultValue={editingRequest?.title}
              placeholder="Desired title of the graphic (optional)"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Committee + Graphic Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Committee <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="committee"
                defaultValue={editingRequest?.committee ?? ''}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                {COMMITTEES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Type of Graphic <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="graphic_type"
                value={graphicType}
                onChange={(e) => handleGraphicTypeChange(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                {GRAPHIC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="Other">Other...</option>
              </select>
            </div>
          </div>

          {/* Other graphic type text input */}
          {isOtherGraphic && (
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Specify Graphic Type <span className="text-red-400">*</span>
              </label>
              <input
                required={isOtherGraphic}
                value={otherGraphicValue}
                onChange={(e) => setOtherGraphicValue(e.target.value)}
                placeholder="e.g. LinkedIn Banner"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Content (optional) */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">What would you like the graphic to communicate?</label>
            <textarea
              name="content"
              rows={3}
              defaultValue={editingRequest?.content}
              placeholder="Key message, text elements, etc."
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Location + Event Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
              <input
                name="location"
                defaultValue={editingRequest?.location ?? ''}
                placeholder="e.g. Boelter Hall"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="datetime-local"
                name="event_date"
                defaultValue={editingRequest?.event_date ? new Date(editingRequest.event_date).toISOString().slice(0, 16) : ''}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Due Date + Publicity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-blue-600 uppercase text-xs">
                Due Date for Us <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="date"
                name="due_date"
                defaultValue={editingRequest?.due_date ?? ''}
                className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Publicity <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="publicity"
                defaultValue={editingRequest?.publicity ?? ''}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                {PUBLICITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Quarter + Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Quarter <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="quarter"
                defaultValue={editingRequest?.quarter ?? getCurrentQuarter()}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Urgency <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="urgency"
                defaultValue={editingRequest?.urgency ?? 'Not urgent 😙'}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Notes (optional) */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Other Notes</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={editingRequest?.notes ?? ''}
              placeholder="Additional context..."
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit button lives inside the form */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : editingRequest ? 'Save Changes' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
