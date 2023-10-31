import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeampageContent from "../app/team/TeampageContent";
import { getBoardMembers } from "../lib/boardMembers";

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

export async function getServerSideProps() {
  const data = await getBoardMembers();
  const team = data.map((entry: any) => {
    const fields = entry.fields;
    return {
      name: fields.name || "Unknown Name",
      class: fields.class || 0,
      roles: fields.roles || [],
      image: fields.imageURL ? fields.imageURL : "/card_icons/winter.svg",
      link: fields.website || fields.github || fields.instagram || "",
    };
  });

  return {
    props: {
      team,
    },
  };
}

export default function TeamPage({ team }: { team: Person[] }) {
  //   console.log(team);
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <TeampageContent data={team} />
      <Footer />
    </main>
  );
}
