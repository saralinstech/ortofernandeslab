import { headers } from "next/headers";

// Só a landing entra no índice. Bio e catálogo continuam acessíveis por link
// direto, mas saem da busca — o catálogo expõe preços, que não devem aparecer
// em resultado de pesquisa.
export async function GET(){
 const h=await headers();
 const host=h.get("x-forwarded-host")??h.get("host")??"localhost:3000";
 const protocol=h.get("x-forwarded-proto")??(host.startsWith("localhost")?"http":"https");
 const body=[
  // Bio e catálogo continuam rastreáveis de propósito: bloquear aqui impediria
  // o robô de ler o noindex dessas páginas, que é o que as tira da busca.
  "User-agent: *",
  "Disallow: /admin",
  "Disallow: /api",
  "Disallow: /cliente",
  "",
  `Sitemap: ${protocol}://${host}/sitemap.xml`,
  "",
 ].join("\n");
 return new Response(body,{headers:{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"}});
}
