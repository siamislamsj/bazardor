import {getProductsByCategory} from '@/lib/data';
export async function GET(request,{params}){const {slug}=await params;return Response.json(await getProductsByCategory(slug));}
