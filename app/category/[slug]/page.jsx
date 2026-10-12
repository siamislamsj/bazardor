import Link from "next/link";
import CategoryClient from "@/components/CategoryClient";
import { getCategory, getProductsByCategory } from "@/lib/data";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">এই ক্যাটাগরি পাওয়া যায়নি</h1>
        <Link href="/" className="btn">হোম পেজে ফিরে যান</Link>
      </div>
    );
  }

  const result = await getProductsByCategory(slug);

  return (
    <div className="wrap py-8">
      <div className="panel p-6 mb-5 flex gap-4 items-center">
        <span className="text-4xl">{category.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="small muted">এই পণ্যের বাজারদর ও পরিবর্তন</p>
        </div>
      </div>

      {result.demo && (
        <p className="mb-4 text-amber-700">API পাওয়া যায়নি — demo data দেখানো হচ্ছে।</p>
      )}

      {result.products.length === 0 ? (
        <div className="text-center py-16">
          <p className="mb-4">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
          <Link href="/" className="btn">হোম পেজে ফিরে যান</Link>
        </div>
      ) : (
        <CategoryClient products={result.products} />
      )}
    </div>
  );
}
