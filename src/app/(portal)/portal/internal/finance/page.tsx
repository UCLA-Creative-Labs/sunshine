'use client';

import { useState, useEffect, useMemo } from 'react';
import { getFinanceRequests } from '@/lib/supabase/financeRequestService';
import { FinanceRequest } from '@/types/financeRequest';
import FinanceRequestBoard from '@/components/portal/internal/finance/FinanceRequestBoard';
import FinanceRequestPanel from '@/components/portal/internal/finance/FinanceRequestPanel';
import { getCurrentQuarter, getAllQuarters } from '@/lib/utils/quarterService';
import { useIsFinanceApprover } from '@/lib/hooks/useIsFinanceApprover';

export default function FinancePage() {
  const [requests, setRequests] = useState<FinanceRequest[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<FinanceRequest | undefined>();
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const quarters = useMemo(() => getAllQuarters('2026-03-21'), []);
  const { isApprover } = useIsFinanceApprover();

  const loadRequests = async () => {
    try {
      const data = await getFinanceRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load finance requests:', err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenCreate = () => {
    setEditingRequest(undefined);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (request: FinanceRequest) => {
    setEditingRequest(request);
    setIsPanelOpen(true);
  };

  const handleRequestSubmit = () => {
    loadRequests();
    setIsPanelOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
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

      <div className="rounded-2xl border border-[#D4D7E5] bg-white shadow-lg p-5 text-sm text-gray-600 leading-relaxed space-y-3">
        <p>
          Use this form to request funding to be made by 🆑 Finance!
        </p>
        <p>
          📣 <strong>IMPORTANT — PLEASE READ:</strong> Please request funding <strong>AT LEAST 4 WEEKS in advance</strong> (the earlier the better!) as funding request forms MANDATE THIS! We would like to get funding for as many things as possible rather than take it out of our account ❤️
        </p>
        <p>
          <strong>Things we CAN get money for:</strong>
        </p>
        <ul className="list-disc list-inside space-y-0.5 pl-2">
          <li>food — request 4 weeks ahead</li>
          <li>supplies for socials — request 4 weeks ahead</li>
          <li>apple developer licenses, web app domains, hardware for projects — request 4 weeks ahead (or better yet at the beginning of the quarter ⇒ the app closes end of WEEK 5) — PROJECT DIRECTORS</li>
          <li>retreat — request 4 weeks ahead — MARKETING DIRECTOR</li>
        </ul>
        <p>
          Please message Aanika and/or Siri as soon as you finish filling out a request below! They will let you know when your request has been processed.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          New +
        </button>
      </div>

      <FinanceRequestBoard
        requests={requests}
        selectedQuarter={selectedQuarter}
        onEditRequest={handleOpenEdit}
        onRefresh={loadRequests}
        isApprover={isApprover}
      />

      <FinanceRequestPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleRequestSubmit}
        editingRequest={editingRequest}
      />
    </div>
  );
}
