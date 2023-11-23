import { MainLayout } from "@/app/_layouts/MainLayout";
import { Aside } from "../home/layout";

export default function Page() {
  return <MainLayout main={<></>} aside={<Aside />} />;
}
