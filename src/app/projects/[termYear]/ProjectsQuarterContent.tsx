import ContentSection from '@/components/ContentSection';
import ProjectQuarterCard from './ProjectQuarterCard';

type ProjectsQuarterContentProps = {
    params: {
        term?: string;
        year?: string;
    };
};

const termMap: { [key: string]: string } = {
    f: 'Fall',
    w: 'Winter',
    s: 'Spring',
};

export default function ProjectsContent({
    params,
}: ProjectsQuarterContentProps) {
    const { term, year } = params;

    const fullTerm = term ? termMap[term] || 'Unknown Term' : 'Unknown Term';

    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
            <ContentSection title={`PROJECTS - ${fullTerm} 20${year}`}>
                <div className="flex flex-col">
                    <h1 className="text-lg">
                        Here are all the projects completed during {fullTerm} 20
                        {year}!
                    </h1>
                    <ProjectQuarterCard />
                </div>
            </ContentSection>
        </div>
    );
}
