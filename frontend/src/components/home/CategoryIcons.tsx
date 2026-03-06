import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryIcons() {
  const icons = [
    { title: "Deals",     img: "Deals" },
    { title: "Grocery",   img: "Grocery" },
    { title: "Essentials",img: "Essentials" },
    { title: "Global Store",img: "Global" },
    { title: "Limited Time",img: "Limited" },
    { title: "Mobiles",   img: "Mobiles" },
    { title: "Laptops",   img: "Laptops" },
    { title: "Beauty",    img: "Beauty" },
    { title: "Home",      img: "Home" },
    { title: "Women's",   img: "Women's Fashion" },
    { title: "Men's",     img: "Men's Fashion" },
    { title: "Appliances",img: "Home Appliances" },
  ];

  return (
    <div className="w-full relative py-6 bg-white overflow-hidden group">
      
      {/* Scrollable Container */}
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 py-2">
        {icons.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center gap-2 cursor-pointer min-w-[100px] shrink-0 hover:-translate-y-1 transition-transform">
            
            {/* Arched Image Container */}
            <div className="w-24 h-28 bg-[var(--color-noon-yellow)] bg-opacity-30 rounded-t-full rounded-b-md flex items-end justify-center overflow-hidden border border-yellow-100 shadow-sm relative pt-4">
               {/* Placeholder for the product/category image */}
               <div className="w-full h-16 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-400">
                 {item.img}
               </div>
            </div>
            
            <span className="text-xs font-semibold text-center text-gray-700 leading-tight w-full">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Visible on hover) */}
      <button className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow hover:shadow-md transition-shadow opacity-0 group-hover:opacity-100 z-10">
        <ChevronLeft size={20} className="text-gray-600" />
      </button>
      <button className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow hover:shadow-md transition-shadow opacity-0 group-hover:opacity-100 z-10">
        <ChevronRight size={20} className="text-gray-600" />
      </button>
      
    </div>
  );
}
