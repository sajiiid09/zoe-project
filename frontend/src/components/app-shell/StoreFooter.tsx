"use client";
import Link from "next/link";
import { 
  Info, 
  EnvelopeSimple, 
  FacebookLogo, 
  TwitterLogo, 
  InstagramLogo, 
  LinkedinLogo,
  AppleLogo,
  GooglePlayLogo,
  CreditCard,
  PaypalLogo
} from "@phosphor-icons/react";

const colLinks = [
  {
    title: "Electronics",
    links: ["Mobiles", "Tablets", "Laptops", "Desktops", "Wearables", "Cameras", "Televisions", "Audio"]
  },
  {
    title: "Fashion",
    links: ["Women's Fashion", "Men's Fashion", "Kids Fashion", "Watches", "Jewellery", "Sneakers", "Eyewear"]
  },
  {
    title: "Home & Kitchen",
    links: ["Bath", "Home Decor", "Kitchen & Dining", "Bedding", "Furniture", "Pet Supplies", "Appliances"]
  },
  {
    title: "Beauty",
    links: ["Fragrance", "Makeup", "Haircare", "Skincare", "Personal Care", "Men's Grooming", "Bath & Body"]
  },
  {
    title: "Baby & Toys",
    links: ["Diapering", "Baby Transport", "Nursing", "Board Games", "Outdoor Play", "Building Toys", "Action Figures"]
  },
  {
    title: "Customer Care",
    links: ["Help Center", "Track Order", "Returns & Refunds", "Contact Us", "Shipping Info", "Payment Options", "Warranty Policy"]
  },
  {
    title: "Company",
    links: ["About Zoe", "Careers", "Press", "Influencer Program", "Affiliates", "Terms of Use", "Privacy Policy"]
  }
];

export const StoreFooter = () => (
  <footer className="store-footer">
    {/* Help Section */}
    <div className="container footer-top-help">
      <div>
        <h3 className="footer-top-help-title">We're Always Here To Help</h3>
        <p className="footer-top-help-desc">Reach out to us through any of these support channels</p>
      </div>
      <div className="footer-help-channels">
        <div className="footer-help-item">
          <div className="footer-help-icon">
            <Info size={28} weight="duotone" />
          </div>
          <div>
            <p className="footer-help-label">Help Center</p>
            <Link href="#" className="footer-help-link">help.zoemarket.com</Link>
          </div>
        </div>
        <div className="footer-help-item">
          <div className="footer-help-icon">
            <EnvelopeSimple size={28} weight="duotone" />
          </div>
          <div>
            <p className="footer-help-label">Email Support</p>
            <Link href="#" className="footer-help-link">care@zoemarket.com</Link>
          </div>
        </div>
      </div>
    </div>

    {/* Menu Matrix */}
    <div className="container footer-matrix">
      {colLinks.map((col) => (
        <div key={col.title}>
          <h4>{col.title}</h4>
          <ul>
            {col.links.map((link) => (
              <li key={link}>
                <Link href="#">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Apps & Socials */}
    <div className="container footer-social-apps">
      <div className="footer-ribbon-group">
        <span className="footer-ribbon-title">Shop On The Go</span>
        <div className="footer-app-links">
          <a href="#" className="footer-app-btn">
            <AppleLogo size={22} weight="fill" />
            <div className="footer-app-btn-text">
              <small>Download on the</small>
              <strong>App Store</strong>
            </div>
          </a>
          <a href="#" className="footer-app-btn">
             <GooglePlayLogo size={22} weight="fill" />
             <div className="footer-app-btn-text">
               <small>GET IT ON</small>
               <strong>Google Play</strong>
             </div>
          </a>
        </div>
      </div>

      <div className="footer-ribbon-group">
        <span className="footer-ribbon-title">Connect With Us</span>
        <div className="footer-social-links">
          <a href="#" className="footer-social-btn">
            <FacebookLogo size={22} weight="fill" />
          </a>
          <a href="#" className="footer-social-btn">
            <TwitterLogo size={22} weight="fill" />
          </a>
          <a href="#" className="footer-social-btn">
            <InstagramLogo size={22} weight="bold" />
          </a>
          <a href="#" className="footer-social-btn">
            <LinkedinLogo size={22} weight="fill" />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="footer-bottom-bar">
      <div className="container footer-bottom-content">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Zoe Market. All Rights Reserved.
        </div>
        
        <div className="footer-payments">
          <div className="footer-payment-icon"><CreditCard size={20} weight="fill" color="#EB001B" /></div>
          <div className="footer-payment-icon"><CreditCard size={20} weight="fill" color="#1A1F71" /></div>
          <div className="footer-payment-icon"><PaypalLogo size={20} weight="fill" color="#00457C" /></div>
          <div className="footer-payment-icon" style={{ fontWeight: 'bold', color: '#14b8a6', padding: '0.15rem 0.5rem' }}>CASH</div>
        </div>

        <ul className="footer-legal-links">
          <li><Link href="#">Careers</Link></li>
          <li><Link href="#">Warranty Policy</Link></li>
          <li><Link href="#">Sell with us</Link></li>
          <li><Link href="#">Terms of Use</Link></li>
          <li><Link href="#">Privacy Policy</Link></li>
          <li><Link href="#">Consumer Rights</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);
