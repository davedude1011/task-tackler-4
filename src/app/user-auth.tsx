"use client";

import { useAuth } from "@clerk/nextjs";
import { type ReactNode, useEffect } from "react";
import { create_user, get_user_data_extra } from "~/server/user-account-server";

export default function UserAuth({ children }: { children: ReactNode }) {
  const user = useAuth();

  useEffect(() => {
    if (user.isSignedIn) {
      create_user()
        .then((response) => {
          console.log(`create_user: ${response}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  return <>{children}</>;
}
