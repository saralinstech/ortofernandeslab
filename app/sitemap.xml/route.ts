import { headers } from "next/headers";

// O sitemap lista apenas a landing: bio e catálogo ficam fora do índice.
export async function GET(){
 const h=await headers();
 const host=h.get("x-forwarded-host")??h.get("host")??"localhost:3000";
 const protocol=h.get("x-forwarded-proto")??(host.startsWith("localhost")?"http":"https");
 const body=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 <url>
  <loc>${protocol}://${host}/</loc>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
 </url>
</urlset>
`;
 return new Response(body,{headers:{"content-type":"application/xml; charset=utf-8","cache-control":"public, max-age=3600"}});
}
