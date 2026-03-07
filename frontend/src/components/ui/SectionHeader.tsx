import Link from "next/link";

export const SectionHeader = ({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}) => (
  <header className="section-header">
    <div>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    {cta ? <Link href={cta.href}>{cta.label}</Link> : null}
  </header>
);
