import { Topic } from '../types';

export const RESEARCH_TOPICS: Topic[] = [
    {
        id: 'purchase-drivers',
        label: 'What drives your purchase decisions?',
        followUps: [
            { id: 'utility-vs-status', question: 'Do you value utility or status more?' },
            { id: 'price-sensitivity', question: 'How much does price impact your choice?' },
            { id: 'brand-heritage', question: 'Does history matter when you buy?' }
        ]
    },
    {
        id: 'limited-releases',
        label: 'How do you view limited releases?',
        followUps: [
            { id: 'scarcity-frustration', question: 'Does scarcity make you want it more or less?' },
            { id: 'bot-culture', question: 'How do you feel about bot culture in drops?' },
            { id: 'resale-value', question: 'Is resale value a factor in your interest?' }
        ]
    },
    {
        id: 'brand-loyalty',
        label: 'What would make you more loyal to a brand?',
        followUps: [
            { id: 'personalization', question: 'Is personalized service important to you?' },
            { id: 'community', question: 'Do you want to be part of a brand community?' },
            { id: 'ethical-practices', question: 'Do ethics influence your long-term loyalty?' }
        ]
    }
];
