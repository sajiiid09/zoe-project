import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="breadcrumbs">
    <ol>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </li>
      ))}
    </ol>
  </nav>
);
