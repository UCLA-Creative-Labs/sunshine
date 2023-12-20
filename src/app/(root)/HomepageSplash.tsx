'use client'
import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

export default function HomepageSplash() {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [balls, setBalls] = useState<Array<any>>([]);

    const game = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (width && height) {
            let c = new fabric.Canvas(canvasEl?.current, {
                width: width,
                height: height
            });
    
            const newBalls: Array<any> = [];
            for (let i = 0; i < 10; i++) {
                const size = Math.floor(Math.random() * 10) + 5;
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
        
                const circle = new fabric.Circle({
                    left: x,
                    top: y,
                    radius: size,
                    fill: '#FEFFD8'
                });

                c.add(circle);
                newBalls.push(circle);
            }
            setBalls(newBalls);

            const interval = setInterval(() => {
                let c = new fabric.Canvas(canvasEl?.current, {
                    width: width,
                    height: height
                });
                let newBalls: Array<any> = [];
                setBalls((balls) => {newBalls = balls; return balls;})
                for (let ball of newBalls) {
                    let offsetX = 0;
                    let offsetY = 0;
                    do {
                        offsetX = Math.floor((Math.random()*2-1) * 10);
                    }
                    while (ball.left + offsetX + ball.radius/2 > width || ball.left + offsetX + ball.radius/2 < 0);
                    ball.left += offsetX;
                    do {
                        offsetY = Math.floor((Math.random()*2-1) * 10);
                    }
                    while (ball.top + offsetY + ball.radius/2 > height || ball.top + offsetY + ball.radius/2 < 0);
                    ball.top += offsetY;
                    c.add(ball);
                    c.renderAll();
                }
                setBalls(newBalls);
            }, 20);

            return () => {
                c.dispose();
                clearInterval(interval);
            }
        }

    }

    useEffect(game, []);

    return (
        <div id="splash" className="relative flex flex-col justify-end min-h-[70vh] min-w-full bg-[#85b6ff] dark:bg-[#000000] p-10 md:px-20 xl:px-60 lg:py-20">
            <h1 id="blurb" className="z-10 text-3xl sm:text-5xl lg:text-6xl tracking-wide lg:w-[80vw] xl:w-[50vw]">
                A community of UCLA creatives working on cool projects to discover even cooler passions
            </h1>
            <div className="absolute top-0 left-0 -z-1">
                <canvas ref={canvasEl} />
            </div>
        </div>
    )
}