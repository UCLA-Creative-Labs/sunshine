import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectsContent from "./ProjectsContent";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <ProjectsContent />
      <Footer />
    </main>
  )
}
