// src/app/projects/[termYear]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProjectsQuarterContent from './ProjectsQuarterContent';

export default function ProjectTermYear() {
    const { termYear } = useParams() as { termYear?: string };

    const [term, year] = termYear
        ? (termYear.match(/[a-zA-Z]+|[0-9]+/g) as [string, string])
        : ['Unknown Term', 'Unknown Year'];

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <ProjectsQuarterContent params={{ term, year }} />
            <Footer />
        </main>
    );
}
