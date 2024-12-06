"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import NavBar from "../components/navbar";
import get_answer from "~/server/seneca-solver-server";
import { Badge } from "~/components/ui/badge";

export default function Page() {
  const show_non_answer_information = false;

  const [seneca_url, set_seneca_url] = useState<string>("");
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

  function InputElements() {
    return (
      <>
        <div>
          <Label>Seneca URL</Label>
          <Input
            placeholder="https://app.senecalearning.com/classroom/course/.../section/.../session"
            value={seneca_url}
            onChange={(e) => {
              set_seneca_url(e.currentTarget.value);
            }}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Input
            disabled={
              (
                seneca_url
                  .split("https://app.senecalearning.com/classroom/course/")[1]
                  ?.split("/section/")[0] ?? ""
              )?.length <= 0
            }
            value={
              seneca_url
                .split("https://app.senecalearning.com/classroom/course/")[1]
                ?.split("/section/")[0] ?? ""
            }
            className={`pointer-events-none !cursor-default ${
              (
                seneca_url
                  .split("https://app.senecalearning.com/classroom/course/")[1]
                  ?.split("/section/")[0] ?? ""
              )?.length > 0 && "border-green-800"
            }`}
          />
          <Input
            disabled={
              (seneca_url.split("/section/")[1]?.split("/session")[0] ?? "")
                ?.length <= 0
            }
            value={seneca_url.split("/section/")[1]?.split("/session")[0] ?? ""}
            className={`pointer-events-none !cursor-default ${
              (seneca_url.split("/section/")[1]?.split("/session")[0] ?? "")
                ?.length > 0 && "border-green-800"
            }`}
          />
        </div>
        <div>
          <Button
            variant={"outline"}
            disabled={
              (
                seneca_url
                  .split("https://app.senecalearning.com/classroom/course/")[1]
                  ?.split("/section/")[0] ?? ""
              )?.length <= 0 ||
              (seneca_url.split("/section/")[1]?.split("/session")[0] ?? "")
                ?.length <= 0
            }
            onClick={() => {
              set_response_stage(1);

              get_answer(
                seneca_url
                  .split("https://app.senecalearning.com/classroom/course/")[1]
                  ?.split("/section/")[0] ?? "",
                seneca_url.split("/section/")[1]?.split("/session")[0] ?? "",
              )
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  set_response_data(response);
                  set_response_stage(2);

                  console.log(response);
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          >
            Solve
          </Button>
        </div>
      </>
    );
  }

  if (response_stage == 0) {
    return (
      <div className="flex h-screen flex-col">
        <NavBar />
        <div className="flex flex-grow items-center justify-center">
          <div className="flex w-1/2 flex-col gap-2">
            <InputElements />
          </div>
        </div>
      </div>
    );
  } else if (response_stage == 1) {
    return (
      <div className="flex h-screen flex-col">
        <NavBar />
        <div className="flex flex-grow flex-row justify-center p-4">
          <div className="flex flex-col gap-2">
            <InputElements />
          </div>
          <div className="flex-grow animate-pulse p-4">Fetching data...</div>
        </div>
      </div>
    );
  } else if (response_stage == 2 && response_data) {
    return (
      <div className="flex h-screen flex-col">
        <NavBar />
        <div className="flex flex-grow flex-row justify-center p-4">
          <div className="flex flex-col gap-2">
            <InputElements />
          </div>
          <div className="flex flex-grow flex-col gap-8 p-4">
            {response_data.contents.map((content) =>
              content.contentModules.map((contentModule) => (
                <div key={contentModule.courseId}>
                  {"examples" in contentModule.content ? (
                    show_non_answer_information ? (
                      // moduleType: concept
                      <div>
                        <div>{contentModule.content.title}</div>
                        <div>{contentModule.content.explenation}</div>
                        {contentModule.content.examples.map((example) => (
                          <div key={example.title}>
                            <div>{example.title}</div>
                            <div>{example.example}</div>
                            <img src={example.url} alt={example.title} />
                          </div>
                        ))}
                      </div>
                    ) : null
                  ) : "toggles" in contentModule.content ? (
                    // moduleType: toggles
                    <div>
                      <div className="font-bold">
                        {contentModule.content.statement}
                        <Badge variant="outline" className="ml-4">
                          toggle
                        </Badge>
                      </div>
                      {contentModule.content.toggles.map((toggle) => (
                        <div key={toggle.correctToggle} className="font-thin">
                          {toggle.correctToggle}
                        </div>
                      ))}
                    </div>
                  ) : "pretest" in contentModule.content ? (
                    // moduleType: list
                    <div>
                      <div className="font-bold">
                        {contentModule.content.statement}
                        <Badge variant="outline" className="ml-4">
                          pretest
                        </Badge>
                      </div>
                      <div>
                        {contentModule.content.values.map(
                          (temp_value, index) => (
                            <div key={index} className="flex flex-row">
                              {temp_value.value.map((value) =>
                                typeof value == "string" ? (
                                  <div key={value} className="font-thin">
                                    {value.replaceAll("<br>", "\n")}
                                  </div>
                                ) : (
                                  <div key={value.word} className="mx-1">
                                    {value.word}
                                  </div>
                                ),
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : "words" in contentModule.content &&
                    "imageURL" in contentModule.content ? (
                    // moduleType: image-description
                    <div>
                      <div className="flex font-bold">
                        <Badge variant="outline">image-description</Badge>
                      </div>
                      <div className="flex flex-row gap-2">
                        <div className="flex w-1/2 flex-row flex-wrap content-start p-2">
                          {contentModule.content.words.map((word) =>
                            typeof word == "string" ? (
                              <div key={word} className="font-thin">
                                {word.replaceAll("<br>", "\n")}
                              </div>
                            ) : (
                              <div key={word.word} className="mx-1">
                                {word.word}
                              </div>
                            ),
                          )}
                        </div>
                        {contentModule.content.imageURL.endsWith("mp4") ? (
                          <video
                            src={contentModule.content.imageURL}
                            className="max-h-36 max-w-96"
                            muted
                            autoPlay
                            loop
                          ></video>
                        ) : (
                          <img
                            src={contentModule.content.imageURL}
                            alt={contentModule.content.imageURL}
                          />
                        )}
                      </div>
                    </div>
                  ) : "words" in contentModule.content ? (
                    // moduleType: wordfill
                    <div className="flex w-1/2 flex-col">
                      <div className="flex font-bold">
                        <Badge variant="outline">wordfill</Badge>
                      </div>
                      <div className="flex flex-row flex-wrap">
                        {contentModule.content.words.map((word) =>
                          typeof word == "string" ? (
                            <div
                              key={word}
                              className="whitespace-nowrap font-thin"
                            >
                              {word.replaceAll("<br>", "\n")}
                            </div>
                          ) : (
                            <div key={word.word} className="mx-1">
                              {word.word}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>How did we get here, ({contentModule.moduleType})</div>
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>um what the hell?!?!?!?!? :[]</div>;
  }
}
