import { getProducts } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

export default async function Home() {
  const result = await getProducts();
  const products = result.products;

  const risers = products
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main className="wrap py-8">
      {result.demo && (
        <p className="bg-amber-50 text-amber-800 text-sm p-3 rounded-xl mb-5">
          API পাওয়া যায়নি — demo data দেখানো হচ্ছে।
        </p>
      )}

      <section className="panel bg-[#fbfdfb] px-6 sm:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-2 text-xs">
            বাংলাদেশের বাজারদর • আজকের আপডেট
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-5 mb-4">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="muted leading-7">
            চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের দাম এক জায়গায় দেখুন।
          </p>
          <a className="btn mt-6" href="#সব-পণ্য">সব পণ্য দেখুন ↓</a>
        </div>
        <div className="text-8xl sm:text-9xl" aria-label="বাজারের ঝুড়ি">🧺🥬</div>
      </section>

      <section className="mt-10">
        <h2 className="font-bold text-xl mb-4">🔺 আজ দাম বেড়েছে</h2>
        <ProductGrid products={risers} />
      </section>

      <section className="mt-10">
        <h2 className="font-bold text-xl mb-4">🔻 আজ দাম কমেছে</h2>
        <ProductGrid products={fallers} />
      </section>

      <section className="mt-10 scroll-mt-8" id="সব-পণ্য">
        <h2 className="font-bold text-xl mb-2">সব পণ্য</h2>
        <p className="muted text-sm mb-4">প্রতিদিনের প্রয়োজনীয় পণ্যের সর্বশেষ দাম</p>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
