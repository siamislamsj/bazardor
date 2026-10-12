import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center">লোড হচ্ছে...</div>}>
      <AuthForm signup={true} />
    </Suspense>
  );
}
