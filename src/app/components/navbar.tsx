"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
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
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ThemeButton } from "~/components/ui/theme-button";

export default function NavBar() {
  const user = useAuth();

  return (
    <div className="flex gap-8 p-4">
      <div className="flex flex-grow flex-row gap-2">
        <SignedOut>
          <SignInButton>
            <Button
              variant={"outline"}
              className="rounded-full dark:border-none dark:bg-[#713f1260] dark:text-white dark:hover:bg-[#713f12]"
            >
              <LogInIcon className="dark:text-[#eab308]" /> Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant={"outline"}
              className="rounded-full dark:border-none dark:bg-[#064e3b60] dark:text-white dark:hover:bg-[#064e3b]"
            >
              <UserPlus2Icon className="dark:text-[#10b981]" /> Sign up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton></UserButton>
        </SignedIn>
      </div>
      <div className="flex flex-row gap-2">
        <ThemeButton />
      </div>
      <div className="flex flex-row gap-2">
        <Link href={"/sparx-solver"}>
          <Button
            variant={"outline"}
            className="rounded-full dark:border-none dark:bg-[#88133760] dark:text-white dark:hover:bg-[#881337]"
          >
            <MonitorSmartphone className="dark:text-[#f43f5e]" /> Sparx solver
          </Button>
        </Link>
        <Link href={"/seneca-solver"}>
          <Button
            variant={"outline"}
            className="rounded-full dark:border-none dark:bg-[#7c2d1260] dark:text-white dark:hover:bg-[#7c2d12]"
          >
            <BookAudioIcon className="dark:text-[#f97316]" /> Seneca solver
          </Button>
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant={"outline"}
          className="rounded-full dark:border-none dark:bg-[#84cc1630] dark:text-white dark:hover:bg-[#84cc1670]"
        >
          <BookOpenText className="dark:text-[#65a30d]" /> Docs
        </Button>
        <Link href={"https://github.com/davedude1011/task-tackler-new"}>
          <Button
            variant={"outline"}
            className="rounded-full dark:border-none dark:bg-[#3b82f630] dark:text-white dark:hover:bg-[#3b82f670]"
          >
            <GithubIcon className="dark:text-[#2563eb]" /> Github
          </Button>
        </Link>
        <SignedIn>
          <Link href={"/dashboard"}>
            <Button
              variant={"outline"}
              className="rounded-full dark:border-none dark:bg-[#9333ea30] dark:text-white dark:hover:bg-[#9333ea70]"
            >
              <User2Icon className="dark:text-[#a855f7]" /> Dashboard
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <Button
            variant={"outline"}
            className="rounded-full dark:border-none dark:bg-[#9333ea30] dark:text-white dark:hover:bg-[#9333ea70]"
            onClick={() => {
              toast("You need an account", {
                description:
                  "To access the dashboard, you need to make an account! :]",
              });
            }}
          >
            <User2Icon className="dark:text-[#a855f7]" /> Dashboard
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}
