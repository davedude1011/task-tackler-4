"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import NavBar from "../components/navbar";
import get_answer from "~/server/seneca-solver-server";
import { Badge } from "~/components/ui/badge";

export default function Page() {
  const [response_data, set_response_data] = useState<{
    contents: {
      contentModules: {
        content:
          | {
              // moduleType: concept
              examples: {
                example: string;
                title: string;
                url: string;
              }[];
              explenation: string;
              title: string;
            }
          | {
              // moduleType: toggles
              statement: string;
              toggles: {
                correctToggle: string;
                incorrectToggle: string;
              }[];
            }
          | {
              // moduleType: list
              pretest: string;
              statement: string;
              values: {
                value: (
                  | string
                  | {
                      caps: string;
                      otherPermittedWords: string[];
                      word: string;
                    }
                )[];
              }[];
            }
          | {
              // moduleType: wordfill
              words: (
                | string
                | {
                    caps: string;
                    otherPermittedWords: string[];
                    word: string;
                  }
              )[];
            }
          | {
              // moduleType: image-description
              imageURL: string;
              words: (
                | string
                | {
                    caps: string;
                    otherPermittedWords: string[];
                    word: string;
                  }
              )[];
            };
        courseId: string;
        id: string;
        moduleDifficulty: number;
        moduleType: string;
      }[];
      courseId: string;
      id: string;
      tags: string[];
    }[];
  } | null>(null);
  const [response_stage, set_response_stage] = useState<number>(0);

  useEffect(() => {
    const handleMessage = (event: {
      origin: string;
      data: { type: string; message: string };
    }) => {
      if (event.data.type == "seneca-solver-request-answers") {
        console.log(`AUTO-FILL REQUEST ORIGIN: ${event.origin}`);
        console.log("Received seneca url", event.data.message);

        get_answer(
          event.data.message
            .split("https://app.senecalearning.com/classroom/course/")[1]
            ?.split("/section/")[0] ?? "",
          event.data.message.split("/section/")[1]?.split("/session")[0] ?? "",
        )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: any) => {
            window.parent.postMessage(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              { type: "seneca-solver-response-answers", message: response },
              "*",
            );

            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      <div>you shouldnt be able to see this... :O</div>
    </div>
  );
}
