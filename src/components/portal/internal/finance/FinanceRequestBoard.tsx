'use client';

import { useMemo } from 'react';
import { FinanceRequest, FinanceRequestStatus, STATUS_ORDER } from '@/types/financeRequest';
import FinanceRequestCard from './FinanceRequestCard';

const COLUMN_STYLES: Record<FinanceRequestStatus, { bg: string; text: string }> = {
  'Applied': {
    bg: 'bg-[#FFF4E5]',
    text: 'text-gray-700',
  },
  'Not yet processed': {
    bg: 'bg-[#FDF2F1]',
    text: 'text-gray-700',
  },
  'Processed!': {
    bg: 'bg-[#F1F6F1]',
    text: 'text-gray-700',
  },
};

interface FinanceRequestBoardProps {
  requests: FinanceRequest[];
  selectedQuarter: string;
  onEditRequest: (request: FinanceRequest) => void;
  onRefresh: () => void;
  isApprover: boolean;
}

export default function FinanceRequestBoard({ requests, selectedQuarter, onEditRequest, onRefresh, isApprover }: FinanceRequestBoardProps) {
  const filteredRequests = useMemo(
    () => requests.filter(r => r.quarter === selectedQuarter),
    [requests, selectedQuarter]
  );

  const grouped = useMemo(() => {
    const groups: Record<FinanceRequestStatus, FinanceRequest[]> = {
      'Applied': [],
      'Not yet processed': [],
      'Processed!': [],
    };
    filteredRequests.forEach((r) => {
      if (groups[r.status]) {
        groups[r.status].push(r);
      }
    });
    return groups;
  }, [filteredRequests]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {STATUS_ORDER.map((status) => (
        <div
          key={status}
          className={`rounded-2xl ${COLUMN_STYLES[status].bg} flex flex-col p-4 border border-[#D4D7E5]/50 shadow-sm min-h-[400px]`}
        >
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className={`font-bold text-sm ${COLUMN_STYLES[status].text} flex items-center gap-2`}>
              {status}
              <span className="text-gray-400 font-medium ml-1">
                {grouped[status].length}
              </span>
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {grouped[status].map((request) => (
              <FinanceRequestCard
                key={request.id}
                request={request}
                onEdit={() => onEditRequest(request)}
                onRefresh={onRefresh}
                isApprover={isApprover}
              />
            ))}
            {grouped[status].length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-300 text-xs italic">
                No requests found
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
