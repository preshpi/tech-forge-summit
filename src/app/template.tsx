/// <reference types="react/canary" />

import { ViewTransition } from "react";

const transitionClasses = {
  "nav-forward": "route-forward",
  "nav-back": "route-back",
  default: "route-neutral",
};

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransition
      enter={transitionClasses}
      exit={transitionClasses}
      default="none"
    >
      <div className="route-transition-shell">{children}</div>
    </ViewTransition>
  );
}
