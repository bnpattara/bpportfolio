// src/components/CaseStudyCard.tsx
import Image from 'next/image';
import type { CaseStudy } from '../types';

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
    return (<div className="case-card">
            {/* Placeholder image */}
            <div className="case-image">
                <Image src="/placeholder.png" alt={study.title} width={300} height={400} />
            </div>
            <h3 className="case-title">{study.title}</h3>
            <p className="case-subtitle">{study.subtitle}</p>
        </div>);
}
