import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutContent from "./AboutContent";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <AboutContent />
      <Footer />
    </main>
  )
}
