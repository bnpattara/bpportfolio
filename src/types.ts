// src/types.ts
export interface CaseStudy {
    caseId: number;
    stageTag: string;
    title: string;
    subtitle: string;
    thesisInAction: string;
    businessProblem: string;
    strategicInsight: string;
    solution: string[];
    impact: { metric: string; description: string }[];
}
