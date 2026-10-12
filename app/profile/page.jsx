"use client";

import Link from "next/link";
import Protected from "@/components/Protected";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <Protected>
      <div className="wrap py-16 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">আমার প্রোফাইল</h1>
        <p className="muted text-sm mb-6">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        <div className="panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          {user?.image ? (
            <img src={user.image} alt="প্রোফাইল" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold">{user?.name}</p>
            <p className="small muted break-all">{user?.email}</p>
          </div>
          <Link className="btn btn-outline text-sm" href="/profile/edit">✎ নাম আপডেট</Link>
        </div>
      </div>
    </Protected>
  );
}
