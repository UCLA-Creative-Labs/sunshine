'use client';

import { useMemo } from 'react';
import { DesignRequest, Urgency, URGENCY_ORDER } from '@/types/designRequest';
import DesignRequestCard from './DesignRequestCard';


const COLUMN_STYLES: Record<Urgency, { bg: string; dot: string; text: string }> = {
  'Not urgent 😙': {
    bg: 'bg-[#F4F7FB]',
    dot: 'bg-[#3F86FF]',
    text: 'text-gray-700',
  },
  'Very urgent! 😵💫': {
    bg: 'bg-[#FDF2F1]',
    dot: 'bg-[#FF4D4D]',
    text: 'text-gray-700',
  },
  'Completed! 🤩': {
    bg: 'bg-[#F1F6F1]',
    dot: 'bg-[#3BB273]',
    text: 'text-gray-700',
  },
};

interface DesignRequestBoardProps {
  requests: DesignRequest[];
  selectedQuarter: string;
  onEditRequest: (request: DesignRequest) => void;
  onRefresh: () => void;
  isApprover: boolean;
}

export default function DesignRequestBoard({ requests, selectedQuarter, onEditRequest, onRefresh, isApprover }: DesignRequestBoardProps) {
  const filteredRequests = useMemo(
    () => requests.filter(r => r.quarter === selectedQuarter),
    [requests, selectedQuarter]
  );

  const grouped = useMemo(() => {
    const groups: Record<Urgency, DesignRequest[]> = {
      'Very urgent! 😵💫': [],
      'Not urgent 😙': [],
      'Completed! 🤩': [],
    };
    filteredRequests.forEach((r) => {
      if (r.status === 'Done') {
        groups['Completed! 🤩'].push(r);
      } else if (groups[r.urgency]) {
        groups[r.urgency].push(r);
      }
    });
    return groups;
  }, [filteredRequests]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {URGENCY_ORDER.map((urgency) => (
        <div 
          key={urgency} 
          className={`rounded-2xl ${COLUMN_STYLES[urgency].bg} flex flex-col p-4 border border-[#D4D7E5]/50 shadow-sm min-h-[400px]`}
        >
          {/* Column header */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className={`font-bold text-sm ${COLUMN_STYLES[urgency].text} flex items-center gap-2`}>
              {urgency}
              <span className="text-gray-400 font-medium ml-1">
                {grouped[urgency].length}
              </span>
            </h3>
          </div>

          {/* Column body */}
          <div className="space-y-4 flex-1">
            {grouped[urgency].map((request) => (
              <DesignRequestCard
                key={request.id}
                request={request}
                onEdit={() => onEditRequest(request)}
                onRefresh={onRefresh}
                isApprover={isApprover}
              />
            ))}
            {grouped[urgency].length === 0 && (
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
