import IndividualProjectCard, { IndividualProjectProps } from "./IndividualProjectCard";
import projectData from "@/assets/projectData";

interface QuarterListProps {
    quarter: string;
    year: string;
};


const QuarterProjectCardList = ( { quarter, year }: QuarterListProps) => {
    const yearlyProjects = projectData.find(proj => proj.year === year)?.projects;

    if (!yearlyProjects) {
        return <span className="font-bold">No projects yet!</span>;
    }

    return <>
        {yearlyProjects[quarter].length > 0 ? yearlyProjects[quarter].map(project => <IndividualProjectCard key={project.projectName} {...project} />) : <span className="font-bold">No projects yet!</span>}
        </>
};

export default QuarterProjectCardList;