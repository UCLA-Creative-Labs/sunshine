// src/assets/yearData.ts

export interface YearMetadata {
    title: string;
    description: string;
    img: string;
    alt: string;
    url: string;
    year: string;
}

const yearData: YearMetadata[] = [
    {
        title: "2025 - 2026",
        description: "Featured Projects:",
        img: "/projects/25-26/25-26_year_banner.svg",
        alt: "2025 - 2026!",
        url: "projects/25-26",
        year: "25-26",
    },
    {
        title: "2024 - 2025",
        description: "Featured Projects:",
        img: "/projects/24-25/24-25_year_banner.svg",
        alt: "2024 - 2025!",
        url: "projects/24-25",
        year: "24-25",
    },
    {
        title: "2023 - 2024",
        description: "Featured Projects:",
        img: "/projects/23-24/23-24_year_banner.svg",
        alt: "2023 - 2024!",
        url: "projects/23-24",
        year: "23-24",
    },
    // Archived years can be uncommented or added here
    // { title: "2022 - 2023", description: "Featured Projects:", img: "/projects/22-23/22-23_year_banner.svg",
    //     alt: "2022 - 2023", url: "projects/22-23" },
];

export default yearData;
