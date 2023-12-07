import { MainLayout } from "@/app/_layouts/MainLayout";
import { Aside } from "../home/layout";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/");
  return <MainLayout main={<></>} aside={<Aside />} />;
}
