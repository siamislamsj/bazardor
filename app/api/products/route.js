import { getProducts } from "@/lib/data";

export async function GET() {
  const result = await getProducts();
  return Response.json(result);
}
