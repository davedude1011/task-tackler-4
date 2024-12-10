"use client";

import { useEffect, useState } from "react";
import FileInput from "../components/file-input";
import {
  generate_answer,
  get_answer,
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

  useEffect(() => {
    // Function to handle the message from the parent window
    const handleMessage = (
      message: MessageEvent<{ type: string; message: string }>,
    ) => {
      if (message?.data.type === "sparx_solver_response_base_64") {
        console.log("RESPONDED");
        console.log(message?.data.message);

        // Assuming `setImage` is used to display or process the image
        setImage(message?.data.message);
      }
    };

    // Add event listener to receive messages from the parent window
    window.parent.addEventListener("message", handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.parent.removeEventListener("message", handleMessage);
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
  }, [image]);

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
      <div className="flex h-screen flex-col">
        <div className="flex flex-grow flex-col items-center justify-center gap-2">
          {/* Pass setImage to the FileInput component */}
          <FileInput image={image} setImage={setImage} />
          <Button
            onClick={() => {
              window.parent.postMessage(
                { type: "sparx_solver_request_base_64" },
                "*",
              );
            }}
          >
            Auto answer (from sparx)
          </Button>
        </div>
      </div>
    );
  }
}
