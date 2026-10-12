"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Protected({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন");
      router.replace("/signin?callbackUrl=" + encodeURIComponent(pathname));
    }
  }, [isPending, session, router, pathname]);

  if (isPending || !session) {
    return <div className="wrap py-20 text-center">লোড হচ্ছে...</div>;
  }

  return children;
}
