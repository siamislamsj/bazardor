const root='https://openapi.programming-hero.com/api/bazardor';
const alt=root;
export const demo=[
 ['স্বর্ণমাছি চাল','chal','🍚',148,2.1],['মিনিকেট চাল','chal','🍚',99,-2.1],['নাজির চাল','chal','🍚',74,0],['বাটার সাইজ চাল','chal','🍚',66,0.6],
 ['মসুর ডাল','dal','🫘',148,2.5],['মুগ ডাল','dal','🫘',135,0],['ছোলা','dal','🫘',120,-2.4],['আলু','sobji','🥔',30,-3.2],
 ['পেঁয়াজ','sobji','🧅',54,6.2],['কাঁচামরিচ','sobji','🌶️',92,-8.4],['রসুন','sobji','🧄',125,-7.4],['বেগুন','sobji','🍆',44,8.4],
 ['ইলিশ মাছ','mach','🐟',1850,3.1],['রুই মাছ','mach','🐟',450,4.5],['কাতলা মাছ','mach','🐠',430,-4.4],['ব্রয়লার মুরগি','mangsho','🍗',220,1.8],
 ['খাসির মাংস','mangsho','🍖',1250,-0.5],['ডিম','dim-dudh','🥚',155,0.9],['দুধ','dim-dudh','🥛',95,1.4],['সয়াবিন তেল','tel','🫙',198,2.3]
].map((a,i)=>({id:i+1,slug:String(i+1),name:a[0],category:a[1],emoji:a[2],price:a[3],change:a[4],unit:a[0]==='ডিম'?'প্রতি ডজন':a[0]==='দুধ'||a[1]==='tel'?'প্রতি লিটার':'প্রতি কেজি'}));
export const categories=[{slug:'chal',name:'চাল',emoji:'🍚'},{slug:'dal',name:'ডাল',emoji:'🫘'},{slug:'tel',name:'তেল',emoji:'🫙'},{slug:'sobji',name:'সবজি',emoji:'🥬'},{slug:'mach',name:'মাছ',emoji:'🐟'},{slug:'mangsho',name:'মাংস',emoji:'🍗'},{slug:'dim-dudh',name:'ডিম-দুধ',emoji:'🥛'},{slug:'moshla',name:'মসলা',emoji:'🌶️'}];
const num=v=>{if(typeof v==='number')return v;const x=String(v??'0').replace(/[০-৯]/g,d=>'০১২৩৪৫৬৭৮৯'.indexOf(d)).replace(/,/g,'');return Number(x.replace(/[^0-9.\-]/g,''))||0};
const arrayFrom=data=>Array.isArray(data)?data:Array.isArray(data?.products)?data.products:Array.isArray(data?.categories)?data.categories:Array.isArray(data?.data)?data.data:Array.isArray(data?.data?.products)?data.data.products:Array.isArray(data?.result)?data.result:[];
function normalize(item, i) {
  const price = item.today ?? item.todayPrice ?? item.today_price ?? item.currentPrice ?? item.price ?? 0;
  const change = typeof item.change === "object" ? item.change.pct : item.change;
  const percentage = change ?? item.changePercent ?? item.percentageChange ?? 0;
  const units = { kg: "প্রতি কেজি", litre: "প্রতি লিটার", dozen: "প্রতি ডজন", piece: "প্রতি পিস" };
  const unit = item.unit ?? "kg";

  return {
    ...item,
    id: item.id ?? i + 1,
    slug: String(item.slug ?? item.id ?? i + 1),
    name: item.nameBn ?? item.name ?? "পণ্য",
    category: item.category ?? "other",
    emoji: item.image ?? item.categoryIcon ?? "🛒",
    unit: units[unit] ?? unit,
    price: num(price),
    change: num(percentage),
    markets: item.markets ?? []
  };
}
export async function getProducts(){for(const base of [root,alt]){try{const res=await fetch(`${base}/products`,{next:{revalidate:180}});if(!res.ok)continue;const items=arrayFrom(await res.json());if(items.length)return {products:items.map(normalize),demo:false};}catch{}}const backup = (await import("@/data/products.json")).default; return {products:backup.map(normalize),demo:true};}
export async function getProduct(slug){for(const base of [root,alt]){try{const res=await fetch(`${base}/products/${encodeURIComponent(slug)}`,{next:{revalidate:180}});if(!res.ok)continue;const raw=await res.json();const item=raw?.product??raw?.data?.product??raw?.data??raw;if(item && !Array.isArray(item) && (item.id||item.nameBn||item.name||item.title))return normalize(item,0);}catch{}}const {products}=await getProducts();return products.find(x=>String(x.slug)===String(slug)||String(x.id)===String(slug))||null;}
export async function getCategories(){for(const base of [root,alt]){try{const res=await fetch(`${base}/categories`,{next:{revalidate:180}});if(!res.ok)continue;const items=arrayFrom(await res.json());if(items.length)return items.map(x=>typeof x==='string'?{slug:x,name:x,emoji:'🛒'}:{slug:x.slug??x.id??x.name,name:x.nameBn??x.name_bn??x.name??x.slug,emoji:x.emoji??x.icon??'🛒'});}catch{}}return categories;}
const categoryPayload = (raw) => raw?.category ?? raw?.data?.category ?? raw?.data ?? raw;
export async function getCategory(slug){
  for(const base of [root,alt]){
    try{
      const response=await fetch(`${base}/categories/${encodeURIComponent(slug)}`,{next:{revalidate:180}});
      if(!response.ok)continue;
      const raw=categoryPayload(await response.json());
      if(raw && !Array.isArray(raw) && typeof raw==='object' && (raw.slug||raw.name||raw.name_bn||raw.nameBn)){
        return {slug:String(raw.slug??slug),name:raw.nameBn??raw.name_bn??raw.name??slug,emoji:raw.emoji??raw.icon??'🛒'};
      }
    }catch{}
  }
  const all=await getCategories();
  return all.find(c=>String(c.slug).toLowerCase()===String(slug).toLowerCase())??null;
}
export async function getProductsByCategory(slug){
  for(const base of [root,alt]){
    try{
      const response=await fetch(`${base}/products?category=${encodeURIComponent(slug)}`,{next:{revalidate:180}});
      if(!response.ok)continue;
      const raw=await response.json();
      const items=arrayFrom(raw);
      if(items.length || Array.isArray(raw) || Array.isArray(raw?.products) || Array.isArray(raw?.data) || Array.isArray(raw?.data?.products)){
        return {products:items.map(normalize),demo:false};
      }
    }catch{}
  }
  const result=await getProducts();
  const category=await getCategory(slug);
  return {products:result.products.filter(p=>String(p.category).toLowerCase()===String(slug).toLowerCase() || String(p.category).toLowerCase()===String(category?.name??'').toLowerCase()),demo:result.demo};
}
export const bn=v=>Number(v||0).toLocaleString('bn-BD',{maximumFractionDigits:2});
export const changeText=v=>`${v>0?'▲':v<0?'▼':'—'} ${bn(Math.abs(v))}%`;
