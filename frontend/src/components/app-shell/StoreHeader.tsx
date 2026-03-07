"use client";

import Link from "next/link";
import { Heart, LogOut, MapPin, Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/commerce/CartProvider";
import { useWishlist } from "@/components/commerce/WishlistProvider";
import { Drawer } from "@/components/ui/Drawer";
import { SearchField } from "@/components/ui/SearchField";
import { categoryItems, storefrontNav } from "@/lib/config/site";

const roleHome = {
  customer: "/account/profile",
  vendor: "/vendor/dashboard",
  affiliate: "/affiliate/dashboard",
  admin: "/admin/dashboard",
};

export const StoreHeader = () => {
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { session, logout } = useAuth();

  const isCustomer = session?.user.role === "customer";

  return (
    <header className="store-header">
      <div className="top-bar container">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation menu">
          <Menu size={20} />
        </button>
        <Link href="/" className="brand">Zoe Market</Link>
        <div className="desktop-search"><SearchField initialQuery={initialQuery} /></div>
        <div className="header-actions">
          <button className="header-pill"><MapPin size={16} /> Deliver to</button>

          {session ? (
            <div className="account-menu-wrap">
              <button className="icon-btn" aria-label="Account" onClick={() => setAccountMenuOpen((v) => !v)}>
                <User size={18} />
              </button>
              {accountMenuOpen ? (
                <div className="account-menu">
                  <p>Hello, {session.user.fullName.split(" ")[0]}</p>
                  <Link href={roleHome[session.user.role]} onClick={() => setAccountMenuOpen(false)}>My account</Link>
                  {isCustomer ? <Link href="/account/orders" onClick={() => setAccountMenuOpen(false)}>Orders</Link> : null}
                  {isCustomer ? <Link href="/wishlist" onClick={() => setAccountMenuOpen(false)}>Wishlist</Link> : null}
                  <button type="button" onClick={async () => { await logout(); setAccountMenuOpen(false); }}><LogOut size={14} /> Sign out</button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/auth/login" className="header-signin">Sign in</Link>
          )}

          <Link href="/wishlist" className="icon-btn cart-btn" aria-label="Wishlist"><Heart size={18} />{wishlistItems.length ? <span>{wishlistItems.length}</span> : null}</Link>
          <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart"><ShoppingCart size={18} />{itemCount ? <span>{itemCount}</span> : null}</Link>
        </div>
      </div>
      {!session ? <div className="auth-banner container"><span>New here?</span> <Link href="/auth/register">Create account for faster checkout</Link></div> : null}
      <div className="mobile-search container"><SearchField initialQuery={initialQuery} /></div>
      <nav className="category-nav">
        <div className="container nav-scroll" aria-label="Main categories">
          {storefrontNav.map((item) => (
            <Link key={item.label} href={item.href}>{item.label}</Link>
          ))}
        </div>
      </nav>
      <Drawer open={open} onClose={() => setOpen(false)} title="Browse categories">
        <nav className="drawer-links">
          {categoryItems.map((item) => (
            <Link key={item.slug} href={`/categories/${item.slug}`} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {!session ? <Link href="/auth/login" onClick={() => setOpen(false)}>Sign in</Link> : null}
        </nav>
      </Drawer>
    </header>
  );
};
