"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ signup = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");
  const destination = callback && callback.startsWith("/") && !callback.startsWith("//") ? callback : "/";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("পাসওয়ার্ড অন্তত ৬ অক্ষরের দিন");
      return;
    }

    if (signup && password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (signup) {
        result = await authClient.signUp.email({ name, email, password });
      } else {
        result = await authClient.signIn.email({ email, password });
      }

      if (result.error) throw new Error(result.error.message);

      toast.success(signup ? "অ্যাকাউন্ট তৈরি হয়েছে" : "সাইন ইন সফল");
      router.push(destination);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }

  async function socialLogin(provider) {
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: destination });
      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      toast.error(error.message || "লগইন করা যায়নি");
    }
  }

  return (
    <div className="wrap py-16">
      <h1 className="text-2xl font-bold text-center">
        {signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
      </h1>
      <p className="text-center muted text-sm mt-2 mb-6">
        {signup ? "নিচে তথ্য দিয়ে নতুন অ্যাকাউন্ট তৈরি করুন" : "আপনার অ্যাকাউন্টে প্রবেশ করুন"}
      </p>

      <div className="panel max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {signup && (
            <label className="block text-sm">
              নাম
              <input className="field mt-1" required value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          )}
          <label className="block text-sm">
            ইমেইল
            <input className="field mt-1" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block text-sm">
            পাসওয়ার্ড
            <input className="field mt-1" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {signup && (
            <label className="block text-sm">
              পাসওয়ার্ড নিশ্চিত করুন
              <input className="field mt-1" type="password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
          )}
          <button className="btn w-full" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </button>
        </form>

        <p className="text-center small muted my-4">অথবা</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-outline text-xs" onClick={() => socialLogin("google")}>Google</button>
          <button className="btn btn-outline text-xs" onClick={() => socialLogin("github")}>GitHub</button>
        </div>
        <p className="text-center text-sm mt-5">
          {signup ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
          <Link className="text-brand font-semibold" href={signup ? "/signin" : "/signup"}>
            {signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </div>
    </div>
  );
}
