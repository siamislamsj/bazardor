"use client";

import Protected from "./Protected";
import { bn, changeText } from "@/lib/data";

function numberFromPrice(value) {
  if (typeof value === "number") return value;
  const digits = "০১২৩৪৫৬৭৮৯";
  const text = String(value ?? 0).replace(/[০-৯]/g, (digit) => digits.indexOf(digit));
  return Number(text.replace(/,/g, "").replace(/[^0-9.-]/g, "")) || 0;
}

export default function Details({ product }) {
  const markets = Array.isArray(product.markets) ? product.markets : [];

  function marketPrice(market) {
    return numberFromPrice(market.price ?? market.averagePrice ?? market.average ?? product.price);
  }

  const minimumPrices = markets.map((market) => numberFromPrice(market.minPrice ?? market.min ?? marketPrice(market)));
  const maximumPrices = markets.map((market) => numberFromPrice(market.maxPrice ?? market.max ?? marketPrice(market)));
  const minimum = minimumPrices.length ? Math.min(...minimumPrices) : product.price;
  const maximum = maximumPrices.length ? Math.max(...maximumPrices) : product.price;

  return (
    <Protected>
      <div className="wrap py-8">
        <p className="small muted mb-4">হোম › {product.category} › {product.name}</p>
        <div className="panel p-6 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex gap-4 items-center">
            <span className="bg-canvas text-4xl p-4 rounded-xl">{product.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="muted text-sm">{product.description || "প্রতিদিনের প্রয়োজনীয় বাজারদর"} • {product.unit}</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 rounded">{product.category}</span>
            </div>
          </div>
          <div className="bg-canvas rounded-xl p-4 sm:text-right">
            <p className="small muted">আজকের গড় দাম</p>
            <b className="text-2xl">{bn(product.price)} টাকা</b>
            <p className="small muted">{product.unit}</p>
            <p className={product.change > 0 ? "text-red-500" : "text-green-600"}>{changeText(product.change)}</p>
          </div>
        </div>
        <div className="panel p-6 mt-5">
          <h2 className="font-bold mb-4">দামের সারসংক্ষেপ</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[["সর্বনিম্ন দাম", minimum], ["সর্বোচ্চ দাম", maximum], ["গড় দাম", product.price]].map(([label, value]) => (
              <div className="panel p-4" key={label}>
                <p className="small muted">{label}</p>
                <p className="font-bold text-xl text-brand">{bn(value)} টাকা</p>
                <p className="small muted">{product.unit}</p>
              </div>
            ))}
          </div>
          <h2 className="font-bold mt-7 mb-3">বাজারভিত্তিক আজকের দাম</h2>
          {markets.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-canvas">
                  <tr>
                    {["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বোচ্চ", "গড়"].map((title) => <th className="p-3" key={title}>{title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market, index) => (
                    <tr className="border-b" key={index}>
                      <td className="p-3">{market.market ?? market.name ?? market.marketName ?? market.bazar ?? "বাজার"}</td>
                      <td className="p-3">{market.division ?? market.district ?? "—"}</td>
                      <td className="p-3">{bn(numberFromPrice(market.minPrice ?? market.min ?? marketPrice(market)))} টাকা</td>
                      <td className="p-3">{bn(numberFromPrice(market.maxPrice ?? market.max ?? marketPrice(market)))} টাকা</td>
                      <td className="p-3 font-semibold">{bn(marketPrice(market))} টাকা</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted text-sm">এই পণ্যের জন্য API-তে বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </Protected>
  );
}
