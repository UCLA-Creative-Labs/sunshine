import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomepageSplash from "@/app/(root)/HomepageSplash";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HomepageSplash />
      <Footer />
    </main>
  )
}
