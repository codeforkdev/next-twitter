import { SettingsIcon } from "lucide-react";

export default function Settings() {
  const handleClick = () => console.log("clicked settings");
  return (
    <button onClick={handleClick}>
      <SettingsIcon size={20} />
    </button>
  );
}
