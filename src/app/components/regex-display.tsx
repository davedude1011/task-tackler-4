import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// @ts-expect-error it works chillaxe
export default function RegexDisplay({ mathString }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const htmlString = katex.renderToString(mathString, {
    throwOnError: false,
  });

  return (
    <div
      className="math-display"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
}
