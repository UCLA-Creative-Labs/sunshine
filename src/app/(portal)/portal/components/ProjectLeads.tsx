import { Mulish } from 'next/font/google';
import { Member } from '../types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface ProjectLeadsProps {
  leads: Member[];
}

export default function ProjectLeads({ leads }: ProjectLeadsProps) {
  return (
    <section className={`border border-black rounded-lg p-6 text-black ${mulish.className}`}>
      <h2 className="text-xl font-bold mb-4 text-black">Project Leads</h2>
      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-bold text-black">{lead.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-black">{lead.name}</p>
              <p className="text-sm text-black">{lead.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
