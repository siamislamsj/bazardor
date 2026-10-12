import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import Details from "@/components/Details";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return <Details product={product} />;
}
