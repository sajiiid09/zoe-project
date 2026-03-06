// Simplified Hero Slider without external dependencies for now to keep it lightweight
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  return (
    <div className="w-full relative bg-gray-100 mt-2 overflow-hidden h-[300px] md:h-[400px]">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-blue-900 text-white">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold italic tracking-tight uppercase">EXTRA 20% OFF*</h1>
          <p className="text-xl md:text-3xl font-light">With all D360 cards</p>
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase mt-6 hover:scale-105 transition-transform">
            Use Code: EXTRA250
          </button>
        </div>
      </div>
      
      {/* Decorative slider arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10">
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10">
        <ChevronRight size={24} className="text-gray-800" />
      </button>
      
      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
        <span className="w-2 h-2 rounded-full bg-white"></span>
        <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
        <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
      </div>
    </div>
  );
}
