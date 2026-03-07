import Link from "next/link";

const links = [
  { label: "Track an order", href: "/account/orders" },
  { label: "Returns policy", href: "#" },
  { label: "Payment security", href: "#" },
  { label: "Customer support", href: "#" },
];

export const SupportLinks = () => (
  <section className="support-links" aria-label="Support and policy links">
    {links.map((item) => (
      <Link key={item.label} href={item.href}>{item.label}</Link>
    ))}
  </section>
);
