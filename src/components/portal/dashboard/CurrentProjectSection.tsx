"use client";

import { useEffect, useState } from "react";

function useMountAnimation(delay: number) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    return mounted;
}

// TODO: Fetch current project from database
export default function CurrentProjectSection() {
    const mounted = useMountAnimation(80);
    const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

    return (
        <section
            className={`transform transition-all duration-300 ease-out ${enterClasses}`}
            style={{ transitionDelay: "80ms" }}
        >
            <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
                Current Project
            </h2>
            <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
                <p className="text-sm text-black/60">
                    No active project. Join a project to see it here.
                </p>
            </div>
        </section>
    );
}
