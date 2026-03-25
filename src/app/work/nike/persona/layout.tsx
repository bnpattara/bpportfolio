import React from "react";

export default function NikePersonaLabLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { color-scheme: dark; } html, body { background: #0a0a0a !important; min-height: 100%; }`,
        }}
      />
      {children}
    </>
  );
}
