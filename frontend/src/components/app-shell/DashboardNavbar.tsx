"use client";

import { usePathname, useRouter } from "next/navigation";
import { SignOut, Bell, UserCircle, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Create simple breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean);
  
  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("zoe_market_session");
      router.push("/");
    }
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-6 glass-card border-b border-white/40 sticky top-0 z-20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white/60 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle placeholder */}
        <button className="md:hidden p-2 rounded-xl hover:bg-white/60 text-slate-600 transition-colors border border-transparent hover:border-white/40 shadow-sm">
          <List className="w-5 h-5" />
        </button>
        
        {/* Breadcrumb / Title */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400">
          <span className="capitalize">{paths[0] || 'Dashboard'}</span>
          {paths.length > 1 && (
            <>
              <span className="text-slate-300">/</span>
              <span className="capitalize text-emerald-800 font-semibold bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                {paths[paths.length - 1].replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-white text-slate-500 transition-all border border-transparent hover:border-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-[1.5px] border-white shadow-sm"></span>
        </button>
        
        {/* Profile / User dropdown placeholder */}
        <button className="p-2 rounded-xl hover:bg-white text-slate-500 transition-all border border-transparent hover:border-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hidden sm:flex">
          <UserCircle className="w-6 h-6" />
        </button>

        <div className="w-[1px] h-8 bg-slate-200/60 mx-1 sm:mx-2 hidden sm:block"></div>

        {/* Sign Out Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-white hover:bg-rose-50 rounded-xl transition-all border border-rose-100 shadow-[0_2px_8px_rgba(225,29,72,0.06)] hover:shadow-[0_4px_12px_rgba(225,29,72,0.12)] ml-1"
        >
          <SignOut className="w-4 h-4" weight="bold" />
          <span className="hidden sm:inline">Sign Out</span>
        </motion.button>
      </div>
    </header>
  );
};
