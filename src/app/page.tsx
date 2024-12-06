import { ThemeButton } from "~/components/ui/theme-button";
import NavBar from "./components/navbar";
import { Button } from "~/components/ui/button";
import { Chrome, Download } from "lucide-react";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="text-9xl">Task-Tackler</div>
        <div className="italic">v4 is now released :]</div>
        <div className="flex flex-row gap-2 pt-8">
          <Button>
            <Download /> Download
          </Button>
          <Button variant={"outline"}>
            <Download /> Github
          </Button>
        </div>
      </div>
    </div>
  );
}
