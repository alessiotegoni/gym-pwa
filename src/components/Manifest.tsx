"use client";

import { useEffect } from "react";

export default function Manifest() {
  useEffect(() => {
    const manifestLink = document.querySelector<HTMLLinkElement>(
      'link[rel="manifest"]'
    );
    console.log(manifestLink);

    if (manifestLink) manifestLink.crossOrigin = "use-credentials";
  }, []);

  return <></>;
}
