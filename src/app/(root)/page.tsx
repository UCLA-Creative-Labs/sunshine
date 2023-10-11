import About from "@/app/(root)/About";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Splash from "@/app/(root)/Splash";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Splash />
      <About />
      <Footer />
    </main>
  )
}
