import { SearchIcon } from "lucide-react";

export default function SearchUsers() {
  return (
    <label
      htmlFor="searchusers"
      className="flex items-center gap-4 rounded-full bg-[#202327] px-5 py-2"
    >
      <SearchIcon size={20} className="stroke-[#696e73]" />
      <input
        id="searchusers"
        type="text"
        placeholder="Search"
        className="flex-1 bg-transparent outline-none placeholder:text-[#696e73]"
      />
    </label>
  );
}
