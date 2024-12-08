"use client";

import { MessageSquare, UserMinus2Icon, UserPlus2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { add_friend, remove_friend } from "~/server/user-account-server";

function FriendBlock({
  name,
  profile_url,
  clerk_id,
  set_selected_friend_clerk,
}: {
  name: string;
  profile_url: string;
  clerk_id: string;
  set_selected_friend_clerk?: (selected_reciever_clerk: string) => void;
}) {
  const [current_clerk_id, set_current_clerk_id] = useState("");

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarImage src={profile_url} />
          <AvatarFallback>pfp</AvatarFallback>
        </Avatar>
        <div>{name}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            if (set_selected_friend_clerk) {
              if (current_clerk_id == clerk_id) {
                set_selected_friend_clerk("");
                set_current_clerk_id("");
              } else {
                set_selected_friend_clerk(clerk_id);
                set_current_clerk_id(clerk_id);
              }
            }
          }}
        >
          <MessageSquare />
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            remove_friend(clerk_id)
              .then((response) => {
                if (response) {
                  toast("Friend removed");
                } else {
                  console.log(response);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          <UserMinus2Icon />
        </Button>
      </div>
    </div>
  );
}

function AddFriendInput() {
  const [word_one, set_word_one] = useState("");
  const [word_two, set_word_two] = useState("");

  return (
    <div className="flex flex-row items-start gap-2">
      <div className="flex flex-row gap-2">
        <Input
          placeholder="word 1"
          className="w-36"
          value={word_one}
          onChange={(e) => {
            if (!e.currentTarget.value.includes(".")) {
              set_word_one(e.currentTarget.value);
            }
          }}
          onPaste={(e) => {
            if (e.clipboardData.getData("text").includes(".")) {
              set_word_one(e.clipboardData.getData("text").split(".")[0] ?? "");
              set_word_two(e.clipboardData.getData("text").split(".")[1] ?? "");
            }
          }}
        />
        <div className="flex items-end">.</div>
        <Input
          placeholder="word 2"
          className="w-36"
          value={word_two}
          onChange={(e) => set_word_two(e.currentTarget.value)}
          onPaste={(e) => {
            set_word_one(e.currentTarget.value.split(".")[0] ?? "");
            set_word_two(e.currentTarget.value.split(".")[1] ?? "");
          }}
        />
      </div>

      <Button
        size="icon"
        variant={"outline"}
        onClick={() => {
          if (word_one.length == 0 || word_two.length == 0) {
            toast("Invalid UserID", {
              description: "Both word 1 and word 2 must be filled correctly!",
            });
            return null;
          }
          add_friend(`${word_one}.${word_two}`)
            .then((response) => {
              if (typeof response == "string") {
                toast(`Successfully added ${response}`, {
                  description: `${response} has been successfully added to your friends list :]`,
                });
              } else if (response == 0) {
                toast("Invalid UserID", {
                  description: `The UserID '${word_one}.${word_two}' did not match any known in our database :[`,
                });
              } else if (response == 1) {
                toast("Invalid UserID", {
                  description: `You are already friends with the User '${word_one}.${word_two}'!`,
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        <UserPlus2Icon size={18} />
      </Button>
    </div>
  );
}

export default function FriendManagement({
  friend_list_data,
  set_selected_friend_clerk,
}: {
  friend_list_data:
    | {
        friend_name: string;
        friend_profile_url: string;
        friend_clerk_id: string;
      }[]
    | null;
  set_selected_friend_clerk?: (selected_reciever_clerk: string) => void;
}) {
  return (
    <div className="flex flex-grow flex-col gap-4 rounded-md border p-2">
      <div className="flex flex-row justify-between">
        <Label className="p-2 text-xl font-semibold">Friend Management</Label>
        <AddFriendInput />
      </div>
      <div className="p-2">
        {friend_list_data ? (
          friend_list_data?.length > 0 ? (
            friend_list_data?.map((friend_data) => (
              <FriendBlock
                name={friend_data.friend_name}
                profile_url={friend_data.friend_profile_url}
                clerk_id={friend_data.friend_clerk_id}
                set_selected_friend_clerk={set_selected_friend_clerk}
                key={friend_data.friend_clerk_id}
              />
            ))
          ) : (
            <div className="font-light italic">No friends?</div>
          )
        ) : (
          <div className="animate-pulse font-light">Loading friends...</div>
        )}
      </div>
    </div>
  );
}
