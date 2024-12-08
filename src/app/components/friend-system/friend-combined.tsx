"use client";

import { useEffect, useState } from "react";
import FriendManagement from "./friend-management";
import FriendMessages from "./friend-messages";
import {
  get_friend_list_data,
  get_user_data,
} from "~/server/user-account-server";

export default function FriendCombined() {
  const [user_data, set_user_data] = useState<{
    user_id: string | null | undefined;
    is_special: boolean | null | undefined;
    recieved_messages: unknown;
    friend_ids: unknown;
  } | null>(null);

  const [friend_list_data, set_friend_list_data] = useState<
    | {
        friend_name: string;
        friend_profile_url: string;
        friend_clerk_id: string;
      }[]
    | null
  >(null);
  const [selected_friend_clerk, set_selected_friend_clerk] = useState<
    string | null
  >(null);

  useEffect(() => {
    get_user_data()
      .then((response) => {
        if (response) {
          // @ts-expect-error it works but shows an error :-)
          set_user_data(response);

          get_friend_list_data(response.friend_ids as string[])
            .then((response) => {
              if (response) {
                set_friend_list_data(response);
                console.log(response);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <FriendManagement {...{ friend_list_data, set_selected_friend_clerk }} />
      <FriendMessages reciever_clerk={selected_friend_clerk} />
    </>
  );
}
