"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TransitionReceiver
 *
 * Hero-expand transition: on mount, reads sessionStorage for pending transition
 * from the homepage accordion. Renders an overlay that starts at the panel's
 * rect and fluidly expands to full viewport: then fades out to reveal the
 * case study hero beneath.
 */
export default function TransitionReceiver() {
    const [data, setData] = useState<{
        bg: string;
        name: string;
        image: string | null;
        rect: { top: number; left: number; width: number; height: number } | null;
    } | null>(() => {
        if (typeof window === "undefined") return null;
        const bg = sessionStorage.getItem("ptBg");
        const name = sessionStorage.getItem("ptName");
        if (!bg || !name) return null;
        const image = sessionStorage.getItem("ptImage");
        const rectRaw = sessionStorage.getItem("ptRect");
        const rect = rectRaw ? (JSON.parse(rectRaw) as { top: number; left: number; width: number; height: number }) : null;
        return { bg, name, image, rect };
    });
    const [phase, setPhase] = useState<"expand" | "fade" | "done">("expand");
    const [expanded, setExpanded] = useState(false);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!data || startedRef.current) return;
        startedRef.current = true;

        sessionStorage.removeItem("ptBg");
        sessionStorage.removeItem("ptName");
        sessionStorage.removeItem("ptImage");
        sessionStorage.removeItem("ptRect");

        // Double rAF: paint at rect first, then trigger expand animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setExpanded(true));
        });

        // Expand (350ms) → fade (250ms) → unmount. Keep total under 800ms so case study is usable quickly.
        const expandDone = setTimeout(() => setPhase("fade"), 380);
        const fadeDone = setTimeout(() => setPhase("done"), 680);
        const forceUnmount = setTimeout(() => setData(null), 1200);

        return () => {
            clearTimeout(expandDone);
            clearTimeout(fadeDone);
            clearTimeout(forceUnmount);
        };
    }, [data]);

    useEffect(() => {
        if (phase === "done") {
            const t = setTimeout(() => setData(null), 50);
            return () => clearTimeout(t);
        }
    }, [phase]);

    if (!data) return null;

    /* Match case study hero gradient for seamless merge: image + dark-bottom scrim */
    const bgStyle = data.image
        ? { background: `linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 35%, transparent 60%), url(${data.image}) center/cover no-repeat` }
        : { background: data.bg };

    const rect = data.rect;
    const hasRect = rect && rect.width > 0 && rect.height > 0;

    return (<div
            className={`hero-expand-overlay${!hasRect ? " hero-expand-overlay--full" : ""}${hasRect && !expanded ? " hero-expand-overlay--from-rect" : ""}${expanded ? " hero-expand-overlay--expanded" : ""}${phase === "fade" ? " hero-expand-overlay--fade" : ""}`}
            style={{
                ...bgStyle,
                ...(hasRect && !expanded
                    ? {
                          top: rect!.top,
                          left: rect!.left,
                          width: rect!.width,
                          height: rect!.height,
                      }
                    : {}),
            }}
            aria-hidden="true"
        />);
}
