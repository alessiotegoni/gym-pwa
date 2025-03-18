"use client";

import { useEffect } from "react";

export default function Manifest() {
  useEffect(() => {
    const manifestLink = document.querySelector<HTMLLinkElement>(
      'link[rel="manifest"]'
    );

    if (manifestLink) manifestLink.crossOrigin = "use-credentials";
  }, []);

  return <></>;
}
