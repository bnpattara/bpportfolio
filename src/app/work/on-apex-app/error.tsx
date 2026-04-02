"use client";

export default function OnApexAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (<div
      style={{
        minHeight: "100dvh",
        background: "#0C0C0C",
        color: "#F0F0EA",
        padding: 32,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
        On Apex app encountered an error
      </div>
      <pre
        style={{
          fontSize: 11,
          color: "#E8FF3C",
          maxWidth: "100%",
          overflow: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {error.message}
      </pre>
      <button
        onClick={reset}
        style={{
          padding: "10px 20px",
          background: "#E8FF3C",
          color: "#0A0A0A",
          border: "none",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>);
}
