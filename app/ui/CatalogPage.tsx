"use client";
import { useCallback,useEffect,useMemo,useRef,useState } from "react";
import Link from "next/link";
import { ArrowUp,Check,Info,Instagram,Maximize2,Minus,PackageOpen,Plus,Search,ShoppingBag,X } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { Product } from "../catalog";
import { fetchProducts } from "../fetch-products";

type CartItem=Product&{quantity:number};
const phone="5591983160016";
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const wa=(message:string)=>`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
const INSTAGRAM_USER="ortofernandeslab";
const INSTAGRAM=`https://instagram.com/${INSTAGRAM_USER}`;
// Ordem de exibição das famílias no catálogo. Categoria fora desta lista
// aparece depois delas, em ordem alfabética.
const FAMILY_ORDER=["Removíveis","Ortopédicos funcionais","Fixos","Placas","Acessórios","Outros"];
const familyRank=(category:string)=>{const i=FAMILY_ORDER.indexOf(category);return i<0?FAMILY_ORDER.length:i};
const byName=(a:Product,b:Product)=>a.name.trim().localeCompare(b.name.trim(),"pt-BR",{sensitivity:"base"});

export default function CatalogPage(){
 const [products,setProducts]=useState<Product[]>([]),[loading,setLoading]=useState(true),[filter,setFilter]=useState("Todos"),[query,setQuery]=useState(""),[cart,setCart]=useState<CartItem[]>([]),[open,setOpen]=useState(false),[customer,setCustomer]=useState(""),[sending,setSending]=useState(false),[sendError,setSendError]=useState(""),[whatsappLink,setWhatsappLink]=useState("");
 useEffect(()=>{let vivo=true;fetchProducts().then(lista=>{if(!vivo)return;if(lista)setProducts(lista);setLoading(false)});return()=>{vivo=false}},[]);
 // Nome e categoria são normalizados aqui porque vêm do cadastro manual e
 // chegam com espaço sobrando, o que criaria famílias duplicadas na lista.
 const clean=useMemo(()=>products.map(p=>({...p,name:p.name.trim(),category:p.category.trim()})),[products]);
 const cats=["Todos",...Array.from(new Set(clean.map(p=>p.category)))];
 const shown=useMemo(()=>clean.filter(p=>p.active!==false&&p.publicVisible!==false&&(filter==="Todos"||p.category===filter)&&p.name.toLowerCase().includes(query.toLowerCase())),[clean,filter,query]);
 // Agrupa por família e ordena alfabeticamente dentro de cada uma, para que a
 // rolagem no celular percorra uma família inteira antes de começar a próxima.
 const families=useMemo(()=>{const map=new Map<string,Product[]>();for(const p of shown){const list=map.get(p.category);if(list)list.push(p);else map.set(p.category,[p])}return [...map.entries()].sort(([a],[b])=>familyRank(a)-familyRank(b)||a.localeCompare(b,"pt-BR")).map(([category,items])=>({category,items:[...items].sort(byName)}))},[shown]);
 // Foto ampliada. Fecha no Esc e trava a rolagem do fundo enquanto está aberta.
 const [photo,setPhoto]=useState<Product|null>(null);
 useEffect(()=>{if(!photo)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setPhoto(null)};document.addEventListener("keydown",onKey);const anterior=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=anterior}},[photo]);
 const listTop=useRef<HTMLDivElement|null>(null);
 const [showTop,setShowTop]=useState(false);
 useEffect(()=>{const onScroll=()=>setShowTop(window.scrollY>620);onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
 // Rola até o topo da lista descontando o cabeçalho e a barra de família, que
 // são fixos e cobririam o primeiro card. A âncora precisa ser um elemento
 // comum: medir a própria barra devolveria a posição travada, não a real.
 const backToTop=useCallback(()=>{const node=listTop.current;if(!node)return window.scrollTo({top:0,behavior:"smooth"});const height=(s:string)=>document.querySelector<HTMLElement>(s)?.offsetHeight||0;const y=node.getBoundingClientRect().top+window.scrollY-height(".catalog-header")-height(".catalog-filterbar")-14;window.scrollTo({top:Math.max(0,y),behavior:"smooth"})},[]);
 const count=cart.reduce((sum,item)=>sum+item.quantity,0),total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
 const add=(p:Product)=>setCart(items=>{const existing=items.find(i=>i.id===p.id);return existing?items.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i):[...items,{...p,quantity:1}]});
 const change=(id:number,delta:number)=>setCart(items=>items.map(i=>i.id===id?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0));
 const orderMessage=(orderId?:number)=>{const lines=cart.map((item,index)=>`${index+1}. *${item.name}*\n   Quantidade: ${item.quantity}\n   Valor unitário: ${money(item.price)}\n   Subtotal: ${money(item.price*item.quantity)}`).join("\n\n");return `*SOLICITAÇÃO DE ENCOMENDA*\n*Laboratório Orto Fernandes*${orderId?`\n*Referência:* OF-${String(orderId).padStart(5,"0")}`:""}\n\nOlá! Consultei o catálogo e gostaria de solicitar um orçamento para os itens abaixo:\n\n${lines}\n\n────────────────────\n*Quantidade total:* ${count} ${count===1?"item":"itens"}\n*Valor estimado:* ${money(total)}\n────────────────────\n${customer?`*Solicitante:* ${customer}\n`:""}\nGostaria de confirmar a disponibilidade, o prazo de produção e as condições de entrega. Obrigado!`};
 const finishOrder=async()=>{setSending(true);setSendError("");setWhatsappLink("");let orderId:number|undefined,lastError="Não foi possível registrar o pedido.";const payload=JSON.stringify({customerName:customer,items:cart.map(({id,name,price,quantity})=>({id,name,price,quantity})),total});for(let attempt=0;attempt<2&&!orderId;attempt++){try{const response=await fetch("/api/orders",{method:"POST",headers:{"content-type":"application/json","cache-control":"no-cache"},body:payload,cache:"no-store"});const data=await response.json().catch(()=>({}));if(!response.ok){lastError=data.error||`Falha no servidor (${response.status}).`;continue}orderId=data.order?.id;if(!orderId)lastError="O servidor não confirmou o número do pedido."}catch(error){lastError=error instanceof Error?error.message:lastError}}if(!orderId){setSendError(`${lastError} Atualize a página e tente novamente.`);setSending(false);return}const link=wa(orderMessage(orderId));setWhatsappLink(link);setSending(false);window.location.assign(link)};
 return <main className="catalog-page">
  <header className="catalog-header"><div className="catalog-brand"><img src="/logo-orto.jpg" alt="Logo da Orto Fernandes"/><div><b>ORTO FERNANDES</b><small>CATÁLOGO COM PREÇOS</small></div></div><a href={wa("Olá! Vim pelo catálogo da Orto Fernandes e gostaria de falar com a equipe.")} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/> <span>Atendimento</span></a></header>
  <section className="catalog-intro"><div><span className="kicker">CATÁLOGO 2026.2</span><h1>Encontre o aparelho ideal</h1><p>Consulte os produtos, monte sua lista e envie uma única solicitação pelo WhatsApp.</p><label className="catalog-search"><Search/><input aria-label="Buscar produto" placeholder="Buscar por nome do aparelho..." value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery("")} aria-label="Limpar busca"><X/></button>}</label></div><aside><PackageOpen/><b>{loading?"Carregando":`${clean.filter(p=>p.active!==false&&p.publicVisible!==false).length} produtos`}</b><span>{loading?"Buscando o catálogo":"Catálogo atualizado"}</span></aside></section>
  <div className="catalog-filterbar"><label className="family-select"><span>Família</span><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filtrar por família">{cats.map(c=><option key={c} value={c}>{c}</option>)}</select></label><b className="filterbar-count">{loading?"Carregando...":`${shown.length} ${shown.length===1?"produto":"produtos"}`}</b></div>
  {loading?<section className="price-grid" aria-busy="true">{Array.from({length:6},(_,i)=><article className="price-card skeleton" key={i}><div className="price-image"/><div className="price-card-body"><small/><h2/><p/><div className="price-line"><strong/></div></div></article>)}</section>:families.length?<div className="catalog-list" ref={listTop}>{families.map(({category,items})=><section className="family-block" key={category}><h2 className="family-title"><span>{category}</span><small>{items.length} {items.length===1?"produto":"produtos"}</small></h2><div className="price-grid">{items.map((p,i)=>{const inCart=cart.find(item=>item.id===p.id)?.quantity||0;return <article className="price-card" key={p.id}><button type="button" className={`price-image product-photo-${i%3}`} onClick={()=>setPhoto(p)} aria-label={`Ver foto de ${p.name}`}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} loading="lazy"/>:<img src="/product-placeholder.png" alt="Imagem ilustrativa do produto"/>}<span className="zoom-hint"><Maximize2 size={15}/></span></button><div className="price-card-body"><small>{p.category}</small><h2>{p.name}</h2><p>{p.description}</p><div className="price-line"><strong>{money(p.price)}</strong><a href={wa(`Olá! Consultei o catálogo da Orto Fernandes e gostaria de encomendar “${p.name}”.`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={14}/> Pedir este</a></div><button className={`add-cart ${inCart?"added":""}`} onClick={()=>add(p)}>{inCart?<><Check/> Adicionar mais · {inCart} no carrinho</>:<><Plus/> Adicionar ao carrinho</>}</button></div></article>})}</div></section>)}</div>:<div className="catalog-empty"><Search/><h2>Nenhum aparelho encontrado</h2><p>Tente buscar outro nome ou selecionar uma categoria diferente.</p><button onClick={()=>{setQuery("");setFilter("Todos")}}>Limpar filtros</button></div>}
  <aside className="fee-note"><Info/><div><b>Informação sobre entregas</b><span>Para trabalhos com preço inferior a R$ 50, cobramos taxa de R$ 20 para buscar e entregar.</span></div></aside>
  <footer className="catalog-footer"><Link href="/bio">Voltar para a bio</Link><span className="footer-social"><a href={wa("Olá! Vim pelo catálogo da Orto Fernandes e gostaria de falar com a equipe.")} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp"><WhatsAppIcon size={16}/></a><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label={`Instagram @${INSTAGRAM_USER}`}><Instagram size={16}/></a></span></footer>
  {photo&&<div className="photo-overlay" role="dialog" aria-modal="true" aria-label={`Foto de ${photo.name}`} onMouseDown={e=>{if(e.target===e.currentTarget)setPhoto(null)}}>
   <div className="photo-box">
    <button type="button" className="photo-close" onClick={()=>setPhoto(null)} aria-label="Fechar foto"><X size={18}/></button>
    <div className="photo-frame">{photo.imageUrl?<img src={photo.imageUrl} alt={photo.name}/>:<img src="/product-placeholder.png" alt="Imagem ilustrativa do produto"/>}</div>
    <div className="photo-info">
     <div><small>{photo.category}</small><h2>{photo.name}</h2>{photo.description&&<p>{photo.description}</p>}</div>
     <div className="photo-actions"><strong>{money(photo.price)}</strong>
      <button type="button" className="add-cart" onClick={()=>{add(photo);setPhoto(null)}}><Plus/> Adicionar ao carrinho</button></div>
    </div>
   </div>
  </div>}
  {showTop&&<button type="button" className={`back-to-top${count>0?" with-cart":""}`} onClick={backToTop} aria-label="Voltar ao topo da lista"><ArrowUp/></button>}
  {count>0&&<button className="floating-cart" onClick={()=>setOpen(true)}><span className="cart-bag"><ShoppingBag/></span><span><b>Revisar carrinho</b><small>{count} {count===1?"item selecionado":"itens selecionados"}</small></span><strong>{money(total)}</strong></button>}
  {open&&<div className="cart-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><aside className="cart-drawer"><header><div><span className="kicker">SUA ENCOMENDA</span><h2>Revisar carrinho</h2></div><button onClick={()=>setOpen(false)} aria-label="Fechar carrinho"><X/></button></header><div className="cart-list">{cart.map(item=><article className="cart-row" key={item.id}><div><b>{item.name}</b><small>{money(item.price)} cada</small></div><div className="quantity"><button onClick={()=>change(item.id,-1)} aria-label={`Diminuir ${item.name}`}><Minus/></button><span>{item.quantity}</span><button onClick={()=>change(item.id,1)} aria-label={`Aumentar ${item.name}`}><Plus/></button></div><strong>{money(item.price*item.quantity)}</strong></article>)}</div><div className="cart-summary"><div><span>Itens</span><b>{count}</b></div><div><span>Valor estimado</span><b>{money(total)}</b></div></div><label className="customer-name">Nome ou clínica <input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Para identificar seu pedido"/></label>{sendError&&<p className="order-error">{sendError}</p>}<button className="finish-whatsapp" onClick={finishOrder} disabled={sending}><WhatsAppIcon size={20}/><span><b>{sending?"Registrando pedido...":"Enviar pedido pelo WhatsApp"}</b><small>O pedido será salvo antes de abrir a conversa</small></span></button><button className="clear-cart" onClick={()=>{setCart([]);setOpen(false)}}>Limpar carrinho</button></aside></div>}
 </main>
}
