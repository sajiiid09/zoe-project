"use client";

import Link from "next/link";
import { Heart, SignOut, MapPin, List, ShoppingCart, User } from "@phosphor-icons/react";
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
          <List size={20} weight="bold" />
        </button>
        <Link href="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Using text for now, could be an SVG logo */}
          <span style={{ fontSize: '1.6rem', letterSpacing: '-0.04em' }}>zoe</span>
        </Link>
        <div className="desktop-only border-l border-zinc-900/10 pl-4 ml-2 mr-2">
          <button className="deliver-to-btn">
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', display: 'block', textAlign: 'left' }}>Deliver to</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>Riyadh <MapPin size={14} weight="bold" /></span>
          </button>
        </div>
        <div className="desktop-search"><SearchField initialQuery={initialQuery} /></div>
        <div className="header-actions">
          {session ? (
            <div className="account-menu-wrap">
              <button className="header-action-btn" aria-label="Account" onClick={() => setAccountMenuOpen((v) => !v)}>
                <span className="font-bold text-sm">My Account</span>
                <User size={18} weight="bold" />
              </button>
              {accountMenuOpen ? (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setAccountMenuOpen(false)} />
                  <div className="account-menu" style={{ zIndex: 20 }}>
                    <p>Hello, {session.user.fullName.split(" ")[0]}</p>
                    <Link href={roleHome[session.user.role]} onClick={() => setAccountMenuOpen(false)}>My account</Link>
                    {isCustomer ? <Link href="/account/orders" onClick={() => setAccountMenuOpen(false)}>Orders</Link> : null}
                    {isCustomer ? <Link href="/wishlist" onClick={() => setAccountMenuOpen(false)}>Wishlist</Link> : null}
                    <Link href="/help" onClick={() => setAccountMenuOpen(false)}>Help & Support</Link>
                    <button type="button" onClick={async () => { await logout(); setAccountMenuOpen(false); }}><SignOut size={14} weight="bold" /> Sign out</button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Link href="/auth/login" className="header-action-btn border-r pr-4 mr-2 border-black/10">
              <span className="font-bold text-sm">Sign In</span>
              <User size={18} weight="bold" />
            </Link>
          )}

          <Link href="/wishlist" className="header-action-btn border-r pr-4 mr-2 border-black/10" aria-label="Wishlist">
            <span className="font-bold text-sm">Wishlist</span>
            <div className="cart-badge-wrap"><Heart size={20} weight="bold" />{wishlistItems.length ? <span className="cart-badge">{wishlistItems.length}</span> : null}</div>
          </Link>
          <Link href="/cart" className="header-action-btn" aria-label="Cart">
            <span className="font-bold text-sm">Cart</span>
            <div className="cart-badge-wrap"><ShoppingCart size={20} weight="bold" />{itemCount ? <span className="cart-badge">{itemCount}</span> : null}</div>
          </Link>
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
