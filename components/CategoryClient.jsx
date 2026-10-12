"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";

function getNumber(value) {
  if (typeof value === "number") return value;

  const bangla = "০১২৩৪৫৬৭৮৯";
  const english = "0123456789";
  const text = String(value ?? 0).replace(/[০-৯]/g, (digit) => {
    return english[bangla.indexOf(digit)];
  });

  const number = Number(text.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export default function CategoryClient({ products }) {
  const [sort, setSort] = useState("default");
  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => getNumber(a.price) - getNumber(b.price));
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => getNumber(b.price) - getNumber(a.price));
  }

  return (
    <>
      <div className="panel px-5 py-4 flex justify-end gap-3 items-center mb-5">
        <label htmlFor="sort" className="small muted">সাজান</label>
        <select
          id="sort"
          className="field max-w-52"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>
      <p className="muted text-sm mb-3">
        মোট {products.length.toLocaleString("bn-BD")} টি পণ্য পাওয়া গেছে
      </p>
      <ProductGrid products={sortedProducts} />
    </>
  );
}
