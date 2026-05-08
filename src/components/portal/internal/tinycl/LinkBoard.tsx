'use client';

import { Link } from '@/lib/supabase/linksService';
import LinkCard from './LinkCard';

interface LinkBoardProps {
  links: Link[];
  loading: boolean;
  onEditLink: (link: Link) => void;
  onDeleteLink: (id: string) => void;
  onAddNew: () => void;
}

export default function LinkBoard({ 
  links, 
  loading, 
  onEditLink, 
  onDeleteLink, 
  onAddNew 
}: LinkBoardProps) {
  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full pb-20">
      {loading ? (
        <div className="text-center text-gray-500 py-8 text-sm">Loading links...</div>
      ) : (
        <>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
            />
          ))}

        </>
      )}
    </div>
  );
}
