import NavBar from "./components/navbar";
import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="text-9xl">Task-Tackler</div>
        <div className="italic">v4 is now released :]</div>
        <div className="flex flex-row gap-2 pt-8">
          <Link
            href={
              "https://chromewebstore.google.com/detail/task-tackler/knmelikahkhldfnmafmlikolknhekkmp"
            }
          >
            <Button>
              <Download /> Download
            </Button>
          </Link>
          <Link href={"https://github.com/davedude1011/task-tackler-4"}>
            <Button variant={"outline"}>
              <Download /> Github
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
