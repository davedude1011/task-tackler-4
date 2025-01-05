"use client";

import { useEffect, useState } from "react";
import FileInput from "../components/file-input";
import {
  generate_answer,
  get_answer,
  //get_answer_website,
  upload_image,
} from "~/server/sparx-solver-server";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

function generate_random_number_string(length = 19): string {
  let random_number_string = "";
  for (let i = 0; i < length; i++) {
    random_number_string += Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
  }
  return random_number_string;
}

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const [response_data, set_response_data] = useState<any>(null);
  const [response_stage, set_response_stage] = useState<number>(0);
  /*
  stage 0: nothing;
  stage 1: file uploaded;
  stage 2: generating answer;
  stage 3: display answer;
  */
  const [response_answer_data, set_response_answer_data] = useState<{
    Answer: string;
    AnswerImage: unknown;
    AnswerOcr: string;

    Explanation: string;
    ExplanationImage: unknown;
    ExplanationOcr: string;

    ImagesTemplates: unknown;

    Question: string;
    ReadableTitle: string;
  } | null>(null);

  const [retry_side, set_retry_side] = useState(0); // 0 is fetch from website, 1 is dynamic

  useEffect(() => {
    const handleMessage = (event: {
      origin: string;
      data: { type: string; message: string };
    }) => {
      if (event.data.type == "sparx_solver_response_base_64") {
        console.log(`AUTO-FILL REQUEST ORIGIN: ${event.origin}`);
        console.log("Received base64 image:", event.data.message);
        setImage(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (image) {
      set_response_data(null);
      set_response_stage(0);
      set_response_answer_data(null);

      const temp_device_id = generate_random_number_string();

      upload_image(temp_device_id, image)
        .then(
          (upload_response: {
            Uri: string;
            BaseResp: {
              StatusCode: number;
              StatusMessage: string;
            };
            ImageInfo: {
              Duration: string;
              FileName: string;
              FrameCnt: string;
              ImageFormat: string;
              ImageHeight: string;
              ImageMd5: string;
              ImageSize: string;
              ImageUri: string;
              ImageWidth: string;
            };
          }) => {
            if (upload_response) {
              set_response_data(upload_response);
              set_response_stage(1);

              console.log("STAGE 1");
              console.log(upload_response);

              generate_answer(
                temp_device_id,
                upload_response.ImageInfo.ImageUri || upload_response.Uri,
                upload_response.ImageInfo.ImageWidth ?? "300",
                upload_response.ImageInfo.ImageHeight ?? "300",
              )
                .then(
                  (generate_response: {
                    questionID: string;
                    questionIDStr: string;
                    BaseResp: {
                      Extra: unknown;
                      StatusCode: number;
                      StatusMessage: string;
                      error: unknown;
                      logId: string;
                    };
                  }) => {
                    if (generate_response) {
                      set_response_data(generate_response);
                      set_response_stage(2);

                      console.log("STAGE 2");
                      console.log(generate_response);

                      if (retry_side == 1 || retry_side == 0) {
                        get_answer(
                          temp_device_id,
                          generate_response.questionID ??
                            generate_response.questionIDStr,
                        )
                          .then(
                            (get_response: {
                              WebSolution: {
                                ContentInfo: {
                                  Answer: string;
                                  AnswerImage: unknown;
                                  AnswerOcr: string;

                                  Explanation: string;
                                  ExplanationImage: unknown;
                                  ExplanationOcr: string;

                                  ImagesTemplates: unknown;

                                  Question: string;
                                  ReadableTitle: string;
                                };
                              };
                            }) => {
                              if (get_response) {
                                set_response_data(get_response);
                                set_response_stage(3);

                                console.log("STAGE 3");
                                console.log(get_response);

                                set_response_answer_data(
                                  get_response.WebSolution.ContentInfo,
                                );
                              }
                            },
                          )
                          .catch((error) => {
                            console.error(error);
                          });
                      } else {
                        /*
                        get_answer_website(
                          generate_response.questionID ??
                            generate_response.questionIDStr,
                        )
                          .then((responseHtmlString) => {
                            if (responseHtmlString) {
                              const tempElement = document.createElement("div");
                              tempElement.innerHTML = responseHtmlString;

                              console.log(tempElement);

                              const answerText = tempElement.querySelector(
                                '[class^="PCCacheAnswer_cache-answer-wrap"] [class^="AnswerStructure_as-content"]',
                              )?.textContent;
                              const explanationText = tempElement.querySelector(
                                '[class^="PCCacheAnswer_explanationWrap"] [class^="AnswerStructure_as-content"]',
                              )?.textContent;

                              set_response_data({
                                WebSolution: {
                                  ContentInfo: {
                                    Answer: answerText,

                                    Explanation: explanationText,
                                  },
                                },
                              });
                              set_response_stage(3);
                              console.log("STAGE 3");

                              set_response_answer_data({
                                // @ts-expect-error uhhhh
                                Answer: answerText,
                                // @ts-expect-error uhhhh
                                Explanation: explanationText,
                              });
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                          */
                      }
                    }
                  },
                )
                .catch((error) => {
                  console.error(error);
                });
            }
          },
        )
        .catch((error) => {
          console.error(error);
        });
    }
  }, [image, retry_side]);

  const { setTheme } = useTheme();

  useEffect(() => {
    // Read the 'theme' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const themeFromUrl = urlParams.get("theme");

    // Set the theme to the value from the URL, or default to 'light'
    if (themeFromUrl) {
      setTheme(themeFromUrl); // Assuming 'setTheme' can handle 'light' or 'dark'
    } else {
      setTheme("light"); // Default to light if no theme is specified
    }
  }, [setTheme]);

  if (image) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex flex-grow flex-row">
          <div className="min-h-fit flex-grow p-2">
            {response_stage == 0 ? (
              <div className="animate-pulse">Reading Image...</div>
            ) : response_stage == 1 ? (
              <div className="animate-pulse">
                <div>Successfully loaded Image</div>
                <div>
                  Image location:
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {response_data?.Uri}
                </div>
                <div>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  Image dimensions: {response_data?.ImageInfo?.ImageWidth}x
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {response_data?.ImageInfo?.ImageHeight}
                </div>
              </div>
            ) : response_stage == 2 ? (
              <div className="animate-pulse">
                <div>Successfully loaded Question</div>
                <div>
                  Question ID:
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {response_data?.questionID}
                </div>
              </div>
            ) : response_stage == 3 ? (
              <div className="w-2/3">
                <MathJaxContext>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <div className="text-2xl font-semibold">Answer</div>
                      <MathJax className="text-3xl">
                        {response_answer_data?.Answer}
                      </MathJax>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-2xl font-semibold">Explanation</div>
                      <MathJax className="">
                        {response_answer_data?.Explanation}
                      </MathJax>
                    </div>
                  </div>
                </MathJaxContext>
              </div>
            ) : (
              <div>um, what happend? :[]</div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="flex w-fit flex-grow flex-col items-center justify-center gap-2">
          {/* Pass setImage to the FileInput component */}
          <FileInput image={image} setImage={setImage} />
          <div className="flex w-full flex-row gap-2">
            {/*
              
            <Button
              variant={"outline"}
              onClick={() => {
                set_retry_side(1);
                window.parent.postMessage(
                  { type: "sparx_solver_request_base_64" },
                  "*",
                );
              }}
            >
              Auto (API)
            </Button>
              */}
            <Button
              className="flex-grow"
              onClick={() => {
                set_retry_side(0);
                window.parent.postMessage(
                  { type: "sparx_solver_request_base_64" },
                  "*",
                );
              }}
            >
              Auto answer (default)
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
