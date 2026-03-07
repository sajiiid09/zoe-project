import type { PropsWithChildren } from "react";

export const AppContainer = ({ children }: PropsWithChildren) => (
  <div className="container page-space">{children}</div>
);
