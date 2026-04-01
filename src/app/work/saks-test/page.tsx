"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SaksTestRedirectPage(): null {
  const router = useRouter();
  useEffect(() => {
    router.replace("/work/saks");
  }, [router]);
  return null;
}
