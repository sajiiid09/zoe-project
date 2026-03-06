import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryIcons from "@/components/home/CategoryIcons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-noon-bg)]">
      {/* Top Navigation Blocks */}
      <Header />
      <Navbar />
      
      {/* Main Content Sections */}
      <main className="flex-grow pb-16">
        <HeroSlider />
        <CategoryIcons />
        
        {/* Placeholder for Product Rows */}
        <section className="px-4 md:px-8 mt-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-bold mb-4">More reasons to shop</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {/* Product Cards Placeholder */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="min-w-[180px] h-64 bg-gray-50 border border-gray-100 rounded p-2 flex flex-col justify-end pb-4">
                   <div className="w-full h-32 bg-gray-200 mb-2 rounded animate-pulse" />
                   <div className="w-3/4 h-4 bg-gray-300 rounded mb-2" />
                   <div className="w-1/2 h-4 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
