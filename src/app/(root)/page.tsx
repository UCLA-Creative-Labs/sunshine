import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomepageSplash from "@/app/(root)/HomepageSplash";
import HomepageContent from "./HomepageContent";

export default function Home() {
  const [ mousePos, setMousePos ] = React.useState<number[]>([]);
  const faceRef = React.useRef<HTMLDivElement>(null);
  const [ facePos, setFacePos ] = React.useState<number[]>([97, 68]);

    const onMouseMove = (e: React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setMousePos([ x, y ]);
    };

    React.useEffect(() => {
      const rect = faceRef.current?.getBoundingClientRect();

      setTimeout(() => {
        if (rect && mousePos.length > 0) {
          const centerX = 112 + rect.x;
          const centerY = 112 + rect.y;

          const vectorX = mousePos[0] - centerX;
          const vectorY = mousePos[1] - centerY;

          const magnitude = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));

          if (magnitude < 55) {
            setFacePos([70 + vectorX, 97 + vectorY]);
          } else {
            setFacePos([70 + 55*(vectorX / magnitude), 97 + 55*(vectorY / magnitude)]);
          }
        }
      }, 1);

      // return () => clearTimeout(handler);

    }, [mousePos]);

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HomepageSplash />
      <HomepageContent />
      <Footer />
    </main>
  )
}
