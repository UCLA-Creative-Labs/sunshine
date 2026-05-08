'use client';

import { useState, useEffect, useRef } from 'react';
import { createFinanceRequest, updateFinanceRequest } from '@/lib/supabase/financeRequestService';
import {
  Committee,
  ExpenseCategory,
  FinanceRequest,
} from '@/types/financeRequest';
import { getCurrentQuarter, getAllQuarters } from '@/lib/utils/quarterService';
import { getCurrentUserId } from '@/lib/supabase/profileService';
import { IoClose } from 'react-icons/io5';

const COMMITTEES: Committee[] = ['Marketing', 'Projects', 'Tech', 'Finance'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Supplies',
  'Project Developer Resources',
  'Retreat',
  'Other',
];
const QUARTERS = getAllQuarters('2026-03-21');

interface FinanceRequestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingRequest?: FinanceRequest;
}

export default function FinanceRequestPanel({ isOpen, onClose, onSubmit, editingRequest }: FinanceRequestPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen, editingRequest]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const userId = await getCurrentUserId().catch(() => null);

      const estimatedRaw = formData.get('estimated_amount') as string;
      const exactRaw = formData.get('exact_amount') as string;
      const peopleRaw = formData.get('how_many_people') as string;

      const requestData: any = {
        name: formData.get('name') as string,
        event: (formData.get('event') as string) || null,
        expense_category: formData.get('expense_category') as ExpenseCategory,
        committee: formData.get('committee') as Committee,
        estimated_amount: estimatedRaw ? Number(estimatedRaw) : null,
        exact_amount: exactRaw ? Number(exactRaw) : null,
        receipt: (formData.get('receipt') as string) || null,
        how_many_people: peopleRaw ? Number(peopleRaw) : null,
        what_will_it_cover: (formData.get('what_will_it_cover') as string) || null,
        description: (formData.get('description') as string) || '',
        outcomes: (formData.get('outcomes') as string) || '',
        cost_documentation: (formData.get('cost_documentation') as string) || '',
        event_location: (formData.get('event_location') as string) || null,
        event_date: formData.get('event_date') ? new Date(formData.get('event_date') as string).toISOString() : null,
        due_date: (formData.get('due_date') as string) || null,
        quarter: formData.get('quarter') as string,
        notes: (formData.get('notes') as string) || null,
        created_by: userId,
      };

      if (editingRequest) {
        await updateFinanceRequest(editingRequest.id, requestData);
      } else {
        await createFinanceRequest(requestData);
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
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {editingRequest ? 'Edit Funding Request' : 'New Funding Request'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Request Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              name="name"
              defaultValue={editingRequest?.name}
              placeholder="e.g. Dominos for Demo Day"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Event</label>
            <input
              name="event"
              defaultValue={editingRequest?.event ?? ''}
              placeholder="e.g. Demo Day F24"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                required
                name="expense_category"
                defaultValue={editingRequest?.expense_category ?? ''}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Estimated Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="estimated_amount"
                defaultValue={editingRequest?.estimated_amount ?? ''}
                placeholder="e.g. 162"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Exact Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="exact_amount"
                defaultValue={editingRequest?.exact_amount ?? ''}
                placeholder="e.g. 161.97"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Receipt</label>
              <input
                type="url"
                name="receipt"
                defaultValue={editingRequest?.receipt ?? ''}
                placeholder="https://docs.google.com/..."
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">How Many People</label>
              <input
                type="number"
                min="0"
                name="how_many_people"
                defaultValue={editingRequest?.how_many_people ?? ''}
                placeholder="e.g. 65"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">What Will It Cover?</label>
            <textarea
              name="what_will_it_cover"
              rows={2}
              defaultValue={editingRequest?.what_will_it_cover ?? ''}
              placeholder="e.g. 8 Large Dominos pizzas (4 cheese, 4 pepperoni) — 64 slices total"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Description of Program
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editingRequest?.description}
              placeholder="Brief but detailed summary of your program. Include date, location, & time."
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Program Outcomes
            </label>
            <textarea
              name="outcomes"
              rows={3}
              defaultValue={editingRequest?.outcomes}
              placeholder="What do you hope to accomplish? Concrete ways you will get there."
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Cost Documentation
            </label>
            <input
              name="cost_documentation"
              defaultValue={editingRequest?.cost_documentation}
              placeholder="Link to budget spreadsheet (items, qty, unit/total price, quotes)"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Event Location</label>
              <input
                name="event_location"
                defaultValue={editingRequest?.event_location ?? ''}
                placeholder="e.g. Boelter Hall"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Event Date</label>
              <input
                type="datetime-local"
                name="event_date"
                defaultValue={editingRequest?.event_date ? new Date(editingRequest.event_date).toISOString().slice(0, 16) : ''}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-blue-600 uppercase">
                Funds Needed By
              </label>
              <input
                type="date"
                name="due_date"
                defaultValue={editingRequest?.due_date ?? ''}
                className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          </div>

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
