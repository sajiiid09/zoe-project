import Link from "next/link";

const columns = {
  "Customer Care": ["Help Center", "Track Order", "Returns", "Payments"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  "Sell with Us": ["Vendor Hub", "Affiliate Program", "Seller Policies"],
};

export const StoreFooter = () => (
  <footer className="store-footer">
    <div className="container footer-grid">
      {Object.entries(columns).map(([title, links]) => (
        <section key={title}>
          <h2>{title}</h2>
          <ul>
            {links.map((link) => (
              <li key={link}>
                <Link href="#">{link}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    <div className="container footer-bottom">© {new Date().getFullYear()} Zoe Market. All rights reserved.</div>
  </footer>
);
