import { Mulish } from 'next/font/google';
import { Project } from '../types';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface ProjectDescriptionProps {
  project: Project;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <section className={`border border-black rounded-lg p-6 text-black ${mulish.className}`}>
      <h2 className="text-xl font-bold mb-4 text-black">Project Description</h2>
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <p className="text-black">{project.description}</p>
      </div>
    </section>
  );
}
