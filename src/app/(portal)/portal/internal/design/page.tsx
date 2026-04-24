'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDesignRequests } from '@/lib/supabase/designRequestService';
import { DesignRequest } from '@/types/designRequest';
import DesignRequestBoard from '@/components/portal/internal/design/DesignRequestBoard';
import RequestPanel from '@/components/portal/internal/design/RequestPanel';
import { getCurrentQuarter, getAllQuarters } from '@/lib/utils/quarterService';

export default function DesignPage() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<DesignRequest | undefined>();
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const quarters = useMemo(() => getAllQuarters('2026-03-21'), []);

  const loadRequests = async () => {
    try {
      const data = await getDesignRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load design requests:', err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenCreate = () => {
    setEditingRequest(undefined);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (request: DesignRequest) => {
    setEditingRequest(request);
    setIsPanelOpen(true);
  };

  const handleRequestSubmit = () => {
    loadRequests();
    setIsPanelOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header row — matches Projects page */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Design</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="text-sm border border-[#D4D7E5] rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {quarters.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* Instructions banner */}
      <div className="rounded-2xl border border-[#D4D7E5] bg-white shadow-lg p-5 text-sm text-gray-600 leading-relaxed space-y-3">
        <p>
          Use this form to request a graphic to be made by 🆑 Design (us!) — this can be an Instagram post, presentation slides, social media profile picture, or any kind of visual asset that your team needs!
        </p>
        <p>
          📣 <strong>IMPORTANT — PLEASE READ:</strong> Please request graphics <strong>AT LEAST 1 WEEK in advance</strong> (the earlier the better!) to give Design sufficient time to work on them! We are human beings who need time to come up with ideas and create, and this takes time! ❤️ Ideally, we would NOT want to see requests to be tagged as &quot;Very urgent&quot;, but we will try our best to get that deliverable to you ASAP.
        </p>
        <p>
          You can expect your graphic to be finished by (or before) the due date you set, and we&apos;ll reach out to you when we&apos;re done! Thanks for filling the form out :D 🫡
        </p>
      </div>

      {/* New Button - Below Instructions */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          New +
        </button>
      </div>

      {/* Board */}
      <DesignRequestBoard
        requests={requests}
        selectedQuarter={selectedQuarter}
        onEditRequest={handleOpenEdit}
        onRefresh={loadRequests}
      />

      <RequestPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleRequestSubmit}
        editingRequest={editingRequest}
      />
    </div>
  );
}
