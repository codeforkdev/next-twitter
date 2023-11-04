export const MainLayout = ({
  main,
  aside,
}: {
  main: React.ReactNode;
  aside: React.ReactNode;
}) => {
  return (
    <div className="flex h-full w-full ">
      <main className="min-h-full w-full max-w-[600px] border-r border-white/20">
        {main}
      </main>
      <aside className="sticky top-0 hidden h-screen flex-1 px-5 laptop:block">
        {aside}
      </aside>
    </div>
  );
};
