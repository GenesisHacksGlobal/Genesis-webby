import React, { useEffect } from "react";
import AppProviders from "@app/providers/AppProviders";
import AppRouter from "@app/router/AppRouter";

let hasPrinted = false;

function printDevBanner() {
  if (process.env.NODE_ENV !== "development") return;
  if (hasPrinted) return;
  hasPrinted = true;

  document.fonts.ready.then(() => {
    const lines = [
      " ▄████▄  ██████  ███▄  ██  ██████  ██████  ███  ██████       ██  ██   ████▄   ▄████▄  ██  ███  ██████ ",
      "███  ▀▀  ██▄▄    ██ █▄ ██  ██▄▄    ██▄▄    ███  ██▄▄         ██  ██  ██  ██  ███  ▀▀  ██▄██   ██▄▄   ",
      "███ ▄██  ██▀▀    ██  ▀███  ██▀▀        ██  ███      ██       ██████  ██████  ███ ▄██  ██▀██       ██ ",
      " ▀████▀  ██████  ██   ▀██  ██████  ██████  ███  ██████       ██  ██  ██  ██   ▀████▀  ██  ███  ██████ ",
    ];

    const colors = ["#FFC2EB", "#FF8AE2", "#FF00CC", "#9E0096"];

    lines.forEach((line, i) => {
      // eslint-disable-next-line no-console
      console.log(
        `%c${line}`,
        `color: ${colors[i]}; font-family: monospace; font-size: 15px; font-weight: bold; line-height: 1.1; text-shadow: 2px 2px 0 #fff;`,
      );
    });
  });
}

export default function App() {
  useEffect(() => {
    printDevBanner();
  }, []);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
