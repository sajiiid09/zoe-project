import { Search } from "lucide-react";

import { TextField } from "@/components/ui/TextField";

export const SearchField = () => {
  return (
    <div className="search-wrap" role="search">
      <Search size={18} aria-hidden="true" />
      <TextField
        aria-label="Search products"
        name="search"
        placeholder="Search for products, brands, and categories"
      />
      <button className="search-submit" type="button">
        Search
      </button>
    </div>
  );
};
