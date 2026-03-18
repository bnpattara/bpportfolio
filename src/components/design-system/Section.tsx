type SectionProps = {
    id?: string;
    title: string;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
};

export default function Section({ id, title, subtitle, children }: SectionProps) {
    return (
        <section id={id} className="section py-20 px-8 max-w-4xl mx-auto">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {subtitle && <div className="section-desc">{subtitle}</div>}
            </div>
            {children}
        </section>
    );
}
