import {getCategory} from '@/lib/data';
export async function GET(request,{params}){const {slug}=await params;const category=await getCategory(slug);return category?Response.json(category):Response.json({error:'Category not found'},{status:404});}
