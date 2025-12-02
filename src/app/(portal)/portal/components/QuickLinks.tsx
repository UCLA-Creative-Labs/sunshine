import { Mulish } from 'next/font/google';
import { QuickLink } from '../types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface QuickLinksProps {
  links: QuickLink[];
}

export default function QuickLinks({ links }: QuickLinksProps) {
  return (
    <section className={`border border-black rounded-lg p-6 text-black ${mulish.className}`}>
      <h2 className="text-xl font-bold mb-4 text-black">Quick Links</h2>
      <div className="flex space-x-4 justify-center">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-16 h-16 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-black">{link.name.charAt(0)}</span>
            </div>
            <span className="text-sm text-black">{link.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
