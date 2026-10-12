
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { categories, bn } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const date = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) return;

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  async function logout() {
    const result = await authClient.signOut();

    if (result.error) {
      toast.error(result.error.message || "সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সাইন আউট সফল");
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="wrap flex min-h-[80px] items-center justify-between gap-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-brand text-white h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-xl">
            🌿
          </span>

          <span>
            <b className="block text-base leading-tight">
              বাজার দর
            </b>

            <span className="small muted">
              {date}
            </span>
          </span>
        </Link>

        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="প্রোফাইল"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                  👤
                </span>
              )}

              <span className="hidden sm:inline">
                {session.user.name} ⌄
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-30 panel shadow-xl p-4 w-60">
                <p className="font-semibold text-sm">
                  {session.user.name}
                </p>

                <p className="small muted truncate">
                  {session.user.email}
                </p>

                <Link
                  onClick={() => setMenuOpen(false)}
                  className="block mt-4 mb-3 text-brand text-sm"
                  href="/profile"
                >
                  আমার প্রোফাইল
                </Link>

                <Link
                  onClick={() => setMenuOpen(false)}
                  className="block mb-3 text-brand text-sm"
                  href="/profile/edit"
                >
                  প্রোফাইল এডিট
                </Link>

                <button
                  className="text-red-500 text-sm"
                  onClick={logout}
                >
                  সাইন আউট
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-center text-sm">
            <Link
              className="px-2 sm:px-3 py-2"
              href="/signin"
            >
              সাইন ইন
            </Link>

            <Link
              className="btn text-sm"
              href="/signup"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      <nav className="border-t border-gray-100 mt-2">
        <div className="wrap flex items-center gap-1 sm:gap-3 overflow-x-auto py-2 whitespace-nowrap text-sm">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`rounded-lg px-3 py-2 ${
                pathname === `/category/${category.slug}`
                  ? "bg-brand text-white"
                  : "hover:bg-green-50"
              }`}
            >
              {category.emoji} {category.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-100 py-2 overflow-hidden text-xs min-h-9">
        {products.length > 0 && (
          <Marquee
            speed={32}
            pauseOnHover
            gradient={false}
          >
            {products.map((product) => (
              <span className="mx-5" key={product.id}>
                {product.emoji} {product.name}{" "}
                {bn(product.price)} টাকা/
                {String(product.unit).replace("প্রতি ", "")}{" "}

                <span
                  className={
                    product.change > 0
                      ? "text-red-500"
                      : product.change < 0
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  {product.change > 0
                    ? "▲"
                    : product.change < 0
                    ? "▼"
                    : "—"}{" "}
                  {bn(Math.abs(product.change))}%
                </span>
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </header>
  );
}
