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
    <header className="app-navbar">
      <div className="app-navbar-left">
        <button className="app-icon-btn hide-desktop" style={{ display: 'none' }}>
          <List size={20} />
        </button>
        
        <div className="app-breadcrumbs">
          <span className="app-breadcrumb-path">{paths[0] || 'Dashboard'}</span>
          {paths.length > 1 && (
            <>
              <span>/</span>
              <span className="app-breadcrumb-current">
                {paths[paths.length - 1].replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="app-navbar-right">
        {/* Notification Bell */}
        <button className="app-icon-btn">
          <Bell size={20} />
          <span className="app-notification-badge"></span>
        </button>
        
        {/* Profile / User dropdown placeholder */}
        <button className="app-icon-btn hide-mobile">
          <UserCircle size={24} />
        </button>

        <div className="app-divider hide-mobile"></div>

        {/* Sign Out Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="app-signout-btn"
        >
          <SignOut weight="bold" size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </header>
  );
};
