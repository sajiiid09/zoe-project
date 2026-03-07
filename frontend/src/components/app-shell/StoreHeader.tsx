"use client";

import Link from "next/link";
import { Heart, MapPin, Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { SearchField } from "@/components/ui/SearchField";
import { categories, storefrontNav } from "@/lib/config/site";

export const StoreHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="store-header">
      <div className="top-bar container">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation menu">
          <Menu size={20} />
        </button>
        <Link href="/" className="brand">Zoe Market</Link>
        <div className="desktop-search"><SearchField /></div>
        <div className="header-actions">
          <button className="header-pill"><MapPin size={16} /> Deliver to</button>
          <Link href="/account/profile" className="icon-btn" aria-label="Account"><User size={18} /></Link>
          <Link href="/wishlist" className="icon-btn" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link href="/cart" className="icon-btn" aria-label="Cart"><ShoppingCart size={18} /></Link>
        </div>
      </div>
      <div className="mobile-search container"><SearchField /></div>
      <nav className="category-nav">
        <div className="container nav-scroll" aria-label="Main categories">
          {storefrontNav.map((item) => (
            <Link key={item.label} href={item.href}>{item.label}</Link>
          ))}
        </div>
      </nav>
      <Drawer open={open} onClose={() => setOpen(false)} title="Browse categories">
        <nav className="drawer-links">
          {categories.map((item) => (
            <Link key={item} href={`/search?category=${item.toLowerCase()}`} onClick={() => setOpen(false)}>
              {item}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
};
