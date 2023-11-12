import { AvatarGrid } from "@/app/_components/AvatarGrid";
import { faker } from "@faker-js/faker";

export default function Page() {
  const images = new Array(4).fill(null).map((i) => faker.image.avatar());
  return <AvatarGrid className="h-20 w-20" images={images} />;
}
