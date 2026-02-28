import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Decormade</h3>
            <p className="text-gray-400">Elegant home decoration pieces for modern living.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=vases" className="hover:text-white transition">
                  Vases
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mirrors" className="hover:text-white transition">
                  Mirrors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">hello@decormade.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Decormade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
