import Chat from "@/app/Chat";

export default function Modal() {
  return (
    <>
      <div className="z-50 fixed top-6 rounded left-1/2 -translate-x-1/2  max-w-2xl w-full bg-white text-black h-16 "></div>
      <div className="z-50 fixed rounded right-20 top-16  max-w-xs w-full bg-white text-black  max-h-[500px] h-full ">
        <Chat />
      </div>
    </>
  );
}
