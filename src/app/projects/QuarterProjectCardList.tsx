import IndividualProjectCard from "./IndividualProjectCard";
import { Project } from '@/types/project';

interface QuarterListProps {
    projects: Project[];
};


const QuarterProjectCardList = ({ projects }: QuarterListProps) => {
    if (!projects || projects.length === 0) {
        return <span className="font-bold">No projects yet!</span>;
    }

    return <>
        {projects.map(project => <IndividualProjectCard key={project.id} {...project} />)}
    </>
};

export default QuarterProjectCardList;