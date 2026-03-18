// src/components/CaseStudyCarousel.tsx
"use client";
import { useEffect, useState } from "react";
import CaseStudyCard from "./CaseStudyCard";
import type { CaseStudy } from "../types";

export default function CaseStudyCarousel() {
    const [studies, setStudies] = useState<CaseStudy[]>([]);

    useEffect(() => {
        // Load JSON data (static import works in client component)
        import("../data/caseStudies.json")
            .then((mod) => setStudies(mod.default))
            .catch((e) => console.error("Failed to load case studies", e));
    }, []);

    return (
        <div className="flex gap-6">
            {studies.map((study) => (
                <CaseStudyCard key={study.caseId} study={study} />
            ))}
        </div>
    );
}
