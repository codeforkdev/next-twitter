import Image from "next/image";
export const Avatar = ({ src }: { src: string }) => {
  return (
    <div className="h-8 w-8 rounded-full overflow-clip relative">
      <Image src={src} alt="avatar" fill />
    </div>
  );
};
