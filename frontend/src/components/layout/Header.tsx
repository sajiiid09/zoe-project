import Link from "next/link";
import { Search, ShoppingCart, User, Heart, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full relative z-50">
      {/* Top Banner (Yellow) */}
      <div className="bg-[var(--color-noon-yellow)] w-full py-3 px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Logo & Location */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="font-bold text-3xl tracking-tighter text-[var(--color-noon-dark)]">
            noon
          </Link>
          
          <div className="hidden md:flex items-center gap-2 cursor-pointer border border-transparent hover:border-black/10 p-1 rounded">
            <div className="w-8 h-6 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              SA {/* Placeholder for Saudi Flag */}
            </div>
            <div className="text-sm leading-tight text-[var(--color-noon-dark)]">
              <span className="block opacity-70 text-xs">Deliver to</span>
              <span className="font-bold flex items-center gap-1">Riyadh <ChevronDown size={14} /></span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-4xl px-4 relative">
          <input 
            type="text" 
            placeholder="What are you looking for?"
            className="w-full py-3 px-4 pr-12 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0 text-[var(--color-noon-dark)] font-medium">
          <div className="hidden lg:block cursor-pointer hover:underline text-sm font-bold">
            العربية
          </div>
          <div className="hidden md:flex items-center gap-1 cursor-pointer hover:opacity-80">
            <span className="text-sm">Hala Customer!</span>
            <ChevronDown size={16} />
          </div>
          <button className="hover:bg-black/5 p-2 rounded-full transition-colors hidden sm:block">
            <Heart size={22} className="text-[var(--color-noon-text)]" />
          </button>
          <button className="flex items-center gap-1 hover:bg-black/5 p-2 rounded transition-colors">
            <ShoppingCart size={22} className="text-[var(--color-noon-text)]" />
            <span className="hidden md:inline text-sm">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
