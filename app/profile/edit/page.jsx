"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Protected from "@/components/Protected";
import { authClient } from "@/lib/auth-client";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  async function updateProfile(event) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: name.trim() });
      if (result.error) {
        toast.error(result.error.message || "তথ্য আপডেট হয়নি");
        return;
      }
      toast.success("নাম আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error("আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Protected>
      <div className="wrap py-16 max-w-xl">
        <h1 className="text-2xl font-bold mb-2">তথ্য আপডেট করুন</h1>
        <p className="muted text-sm mb-6">আপনার প্রোফাইলের নাম পরিবর্তন করুন।</p>
        <form onSubmit={updateProfile} className="panel p-6">
          <label htmlFor="profile-name" className="block text-sm mb-2">নাম</label>
          <input
            id="profile-name"
            className="field mb-5"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
          />
          <button type="submit" disabled={saving} className="btn w-full disabled:opacity-60">
            {saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </div>
    </Protected>
  );
}
