import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
  const categories = [
    "Electronics",
    "Men's Fashion",
    "Women's Fashion",
    "Home",
    "Beauty & Fragrance",
    "Baby",
    "Toys",
    "Sports",
    "Health & Nutrition",
    "Automotive",
  ];

  return (
    <nav className="bg-white border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center text-sm font-semibold max-w-7xl mx-auto px-4 md:px-8">
        
        {/* All Categories Dropdown Trigger */}
        <div className="flex items-center gap-2 py-3 pr-6 text-blue-600 border-r border-gray-200 cursor-pointer hover:bg-gray-50 uppercase tracking-wide">
          <span className="font-bold">ALL CATEGORIES</span>
          <ChevronRight size={16} />
        </div>

        {/* Category Links */}
        <div className="flex items-center gap-6 pl-6">
          {categories.map((category, idx) => (
            <Link key={idx} href={`/category/${category.toLowerCase().replace(/ /g, '-')}`} className="py-3 text-gray-700 hover:text-black hover:underline underline-offset-4 pointer-events-auto">
              {category}
            </Link>
          ))}
        </div>
        
      </div>
    </nav>
  );
}
