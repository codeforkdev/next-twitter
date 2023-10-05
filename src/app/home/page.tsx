export default function Page() {
  return (
    <div>
      <div className="h-[49px] flex flex-col justify-center border-b border-white/20">
        <p className="text-primary text-center text-[15px] tracking-tight">
          Show 105 posts
        </p>
      </div>
      {new Array(200).fill(null).map((v, i) => (
        <div>{i}</div>
      ))}
    </div>
  );
}
