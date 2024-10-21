'use client'

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomepageContent from "./HomepageContent";
import React from "react";

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
    <main className="flex min-h-screen flex-col" onMouseMove={onMouseMove}>
        <Navbar />
        <div className="flex items-end bg-black py-20 relative min-h-[230px]">
          <h1 className="px-20 text-4xl md:w-1/2">
            A community of UCLA creatives working on cool projects to discover even cooler passions.
          </h1>
          <div className="hidden grow md:flex justify-center">
            <div ref={faceRef} className="bg-[url('/sun.svg')] w-[224px] h-[224px] relative">
                <div
                  className="bg-[url('/sunmoon-face.svg')] w-[88px] h-[30px] absolute"
                  style={{ top: facePos[1], left: facePos[0] }}
                />
            </div>
          </div>
        </div>
        <HomepageContent />
        <Footer />
    </main>
  )
}
