import { Lato } from "next/font/google";

const lato = Lato({ weight: "700", subsets: ["latin"] });

interface TeampageSectionProps {
  title?: string;
  children?: React.ReactNode;
}

export default function TeampageSection({
  title,
  children,
}: TeampageSectionProps) {
  return (
    <div className="min-h-72 w-auto flex flex-col mb-6">
      <h1 className={`text-left text-5xl tracking-wide ${lato.className} mb-4`}>
        {title}
      </h1>
      <div className="space-y-8 md:space-y-0 md:flex md:flex-row md:space-x-16">
        {children}
      </div>
    </div>
  );
}
