import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      style={{ scrollBehavior: "smooth" }}
      className="bg-background-black"
    >
      <Head />
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
      </style>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
