import IndividualProjectCard, { IndividualProjectProps } from "./IndividualProjectCard";

interface QuarterListProps {
    quarter: string;
    year: string;
};

const hardcodedProjects: IndividualProjectProps[] = [
    {
        projectName: "FitTogether",
        projectLeads: ["Pranav Sankar"],
        projectDescription: "🌟Transform your fitness journey with FitTogether! 🏃‍♀️🏋️‍♂️ We're more than just an AI-powered app - we're a community dedicated to making fitness fun and inclusive. Whether you're into marathons, yoga, or quick gym sessions, find your ideal workout partner and join group challenges. 🤸‍♀️🏆 Share tips, celebrate progress, and be part of a healthier, more connected society. It's time to fit in fitness, together! 💖🌍 🌟Transform your fitness journey with FitTogether! 🏃‍♀️🏋️‍♂️ We're more than just an AI-powered app - we're a community dedicated to making fitness fun and inclusive. Whether you're into marathons, yoga, or quick gym sessions, find your ideal workout partner and join group challenges. 🤸‍♀️🏆 Share tips, celebrate progress, and be part of a healthier, more connected society. It's time to fit in fitness, together! 💖🌍",
        projectManagers: ["Rohan Gandhi", "Aahil Ali"],
        projectMembers: ["Test 1", "Test 2"],
        demoDayUrl: "https://example.com/demo",
        instaPostUrl: "https://example.com/insta",
        logoUrl: "https://example.com/logo.png",
        prototypeUrl: "https://example.com/frontend-features.png"
    }
];

const QuarterProjectCardList = ( { quarter, year }: QuarterListProps) => {
    return <IndividualProjectCard {...hardcodedProjects[0]} />;
};

export default QuarterProjectCardList;