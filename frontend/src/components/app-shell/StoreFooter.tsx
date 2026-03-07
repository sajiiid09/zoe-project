import Link from "next/link";

const columns = {
  "Customer Care": [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns", href: "#" },
    { label: "Payments", href: "#" },
  ],
  Account: [
    { label: "My Profile", href: "/account/profile" },
    { label: "My Orders", href: "/account/orders" },
    { label: "My Wishlist", href: "/wishlist" },
    { label: "Saved Addresses", href: "/account/addresses" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export const StoreFooter = () => (
  <footer className="store-footer">
    <div className="container footer-grid">
      {Object.entries(columns).map(([title, links]) => (
        <section key={title}>
          <h2>{title}</h2>
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    <div className="container footer-bottom">© {new Date().getFullYear()} Zoe Market. All rights reserved.</div>
  </footer>
);
