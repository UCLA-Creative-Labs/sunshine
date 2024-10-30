import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getDocsByType } from "@/lib/contentfulLib";
import JoinContent from "./JoinContent";

export default async function About() {
  let pLeadLink = "#"
  let pMemLink = "#"
  let bMemLink = "#"

  await getDocsByType('link')
  .then(docs => {
	  docs.map(obj => {
		const link: string = obj.fields.url as string;
	  	if (obj.fields.redirectPath == "general-project-member-application") pMemLink = link;
		else if (obj.fields.redirectPath == "general-project-lead-application") pLeadLink = link;
		else if (obj.fields.redirectPath == "board-application") bMemLink = link;
	  });
  });


  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <JoinContent pLeadLink={pLeadLink} pMemLink={pMemLink} bMemLink={bMemLink} />
      <Footer />
    </main>
  )
}
