import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  BookAudioIcon,
  BookOpenText,
  GithubIcon,
  LogInIcon,
  MonitorSmartphone,
  User2Icon,
  UserPlus2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NavBar() {
  return (
    <div className="flex gap-8 p-4">
      <div className="flex flex-grow flex-row gap-2">
        <SignedOut>
          <SignInButton>
            <Button className="rounded-full bg-[#713f1260] text-white hover:bg-[#713f12]">
              <LogInIcon className="text-[#eab308]" /> Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className="rounded-full bg-[#064e3b60] text-white hover:bg-[#064e3b]">
              <UserPlus2Icon className="text-[#10b981]" /> Sign up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton></UserButton>
        </SignedIn>
      </div>
      <div className="flex flex-row gap-2">
        <Link href={"/sparx-solver"}>
          <Button className="rounded-full bg-[#88133760] text-white hover:bg-[#881337]">
            <MonitorSmartphone className="text-[#f43f5e]" /> Sparx solver
          </Button>
        </Link>
        <Link href={"/seneca-solver"}>
          <Button className="rounded-full bg-[#7c2d1260] text-white hover:bg-[#7c2d12]">
            <BookAudioIcon className="text-[#f97316]" /> Seneca solver
          </Button>
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <Button className="rounded-full bg-[#84cc1630] text-white hover:bg-[#84cc1670]">
          <BookOpenText className="text-[#65a30d]" /> Docs
        </Button>
        <Button className="rounded-full bg-[#3b82f630] text-white hover:bg-[#3b82f670]">
          <GithubIcon className="text-[#2563eb]" /> Github
        </Button>
        <Button className="rounded-full bg-[#9333ea30] text-white hover:bg-[#9333ea70]">
          <User2Icon className="text-[#a855f7]" /> Dashboard
        </Button>
      </div>
    </div>
  );
}
