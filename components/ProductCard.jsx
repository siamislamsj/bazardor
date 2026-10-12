import Link from "next/link";
import { bn, changeText } from "@/lib/data";

export default function ProductCard({ product }) {
  const priceChange = product.change;
  let badgeColor = "badge-flat";

  if (priceChange > 0) badgeColor = "badge-up";
  if (priceChange < 0) badgeColor = "badge-down";

  return (
    <Link href={`/product/${product.slug}`} className="panel p-4 hover:shadow-md block">
      <div className="flex gap-3 items-center">
        <span className="bg-canvas rounded-xl text-2xl p-3">{product.emoji}</span>
        <div>
          <h3 className="font-bold">{product.name}</h3>
          <p className="small muted">{product.unit}</p>
        </div>
      </div>
      <div className="flex justify-between items-end mt-5">
        <div>
          <p className="small muted">আজকের দাম</p>
          <p className="font-bold">{bn(product.price)} টাকা</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {changeText(priceChange)}
        </span>
      </div>
    </Link>
  );
}
