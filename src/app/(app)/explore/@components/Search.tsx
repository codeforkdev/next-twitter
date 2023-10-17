import { SearchIcon } from "lucide-react";
import { FocusEvent, ChangeEvent } from "react";
export default function Search({
  onFocus,
  onBlur,
  onChange,
}: {
  onFocus: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-1 relative">
      <SearchIcon
        className="absolute top-1/2 -translate-y-1/2 left-4"
        size={16}
      />
      <input
        className="bg-[#202327] rounded-full py-1 w-full pl-12 outline-primary"
        placeholder="Search"
        type="text"
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
}
