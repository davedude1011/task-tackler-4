"use client";

import { Badge } from "~/components/ui/badge";
import NavBar from "../components/navbar";
import {
  BookAudioIcon,
  CalculatorIcon,
  Clipboard,
  EyeIcon,
  HomeIcon,
  LightbulbIcon,
  MessageSquare,
  PenLineIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import {
  get_friend_list_data,
  get_user_data,
} from "~/server/user-account-server";
import FriendCombined from "../components/friend-system/friend-combined";

function SettingsSwitch({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 ps-2">
      <div className="flex flex-row items-center gap-2">
        {icon}
        <Label className="text-md font-light">{label}</Label>
      </div>
      <Switch />
    </div>
  );
}

export default function Page() {
  const [user_data, set_user_data] = useState<{
    user_id: string | null | undefined;
    is_special: boolean | null | undefined;
    recieved_messages: unknown;
    friend_ids: unknown;
  } | null>(null);
  const [user_id_visable, set_user_id_visable] = useState(false);

  useEffect(() => {
    get_user_data()
      .then((response) => {
        if (response?.user_id) {
          // @ts-expect-error woah - i dont know tbh, just dont ask
          set_user_data(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex h-fit flex-grow flex-col">
        <div className="flex h-fit w-full flex-row items-end justify-between px-4">
          <div className="text-4xl">Dashboard</div>
          <div
            className={`flex flex-row gap-2 rounded-md border p-2 ${!user_data && "animate-pulse cursor-not-allowed"}`}
          >
            <Badge variant={"outline"}>UserID</Badge>
            <div className="flex items-center px-4">
              {user_id_visable && user_data?.user_id
                ? user_data.user_id
                : "******.******"}
            </div>
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => {
                set_user_id_visable(!user_id_visable);
              }}
            >
              <EyeIcon />
            </Button>
            <Button
              size="icon"
              variant={"outline"}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(user_data?.user_id ?? ""); // Copies user_id to clipboard
                  toast("Copied UserID", {
                    description: `Copied ${
                      user_id_visable && user_data?.user_id
                        ? user_data.user_id
                        : "******.******"
                    }`,
                  });
                } catch (err) {
                  console.error("Failed to copy to clipboard:", err);
                }
              }}
            >
              <Clipboard />
            </Button>
          </div>
        </div>
        <div className="flex flex-grow flex-row gap-4 p-4">
          <div className="flex flex-grow flex-col gap-4 rounded-md border p-4">
            <div>COMING SOON</div>
            {/*
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold">Sparx Maths</Label>
              <SettingsSwitch
                label="Save Bookworks"
                icon={<BookAudioIcon size={18} />}
              />
              <SettingsSwitch
                label="Autofill Bookworks"
                icon={<PenLineIcon size={18} />}
              />
              <SettingsSwitch
                label="Add Chatbot"
                icon={<MessageSquare size={18} />}
              />
              <SettingsSwitch
                label="Add Calculator"
                icon={<CalculatorIcon size={18} />}
              />
              <SettingsSwitch
                label="Add Solution Button"
                icon={<LightbulbIcon size={18} />}
              />
              <SettingsSwitch
                label="Clean Homescreen"
                icon={<HomeIcon size={18} />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold">Educake</Label>
              <SettingsSwitch
                label="Add Chatbot"
                icon={<MessageSquare size={18} />}
              />
              <SettingsSwitch
                label="Add Autocomplete Button"
                icon={<LightbulbIcon size={18} />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold">Seneca</Label>
              <SettingsSwitch
                label="Autfill Inputs"
                icon={<PenLineIcon size={18} />}
              />
            </div>
            */}
          </div>
          <FriendCombined />
        </div>
      </div>
    </div>
  );
}
