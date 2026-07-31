"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { ArrowRight,BadgeCheck,CalendarClock,CheckCircle2,MessageCircle,Ruler,ShieldCheck,Sparkles,Truck } from "lucide-react";
import { Product } from "../catalog";

const phone="5591983160016";
const wa=(message:string)=>`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
const CTA_PRINCIPAL=wa("Olá! Vim pelo site da Orto Fernandes e gostaria de solicitar um orçamento.");

const diferenciais=[
 {icon:Ruler,title:"Precisão em cada peça",text:"Aparelhos confeccionados sob medida, com acabamento conferido peça a peça antes da entrega."},
 {icon:CalendarClock,title:"Prazo que você pode combinar",text:"Alinhamos o prazo de produção no primeiro contato e avisamos quando o trabalho fica pronto."},
 {icon:Truck,title:"Busca e entrega",text:"Retiramos o modelo e entregamos o aparelho pronto na sua clínica, em Belém e região."},
 {icon:ShieldCheck,title:"Materiais selecionados",text:"Trabalhamos com materiais de procedência para garantir resistência e conforto ao paciente."},
];

const passos=[
 {n:"1",title:"Chame no WhatsApp",text:"Conte qual aparelho você precisa. Respondemos com as opções e o prazo."},
 {n:"2",title:"Combinamos a coleta",text:"Buscamos o modelo na sua clínica ou você envia como preferir."},
 {n:"3",title:"Produzimos e entregamos",text:"O aparelho é confeccionado, conferido e entregue pronto para instalar."},
];

export default function LandingPage(){
 const [products,setProducts]=useState<Product[]>([]);
 const [loading,setLoading]=useState(true);
 // Uma falha isolada deixaria a vitrine vazia para sempre, já que não há nova
 // tentativa. Como esta é a página de conversão, tentamos de novo antes de
 // desistir.
 useEffect(()=>{let vivo=true;
  (async()=>{for(let tentativa=0;tentativa<3;tentativa++){
    try{const r=await fetch("/api/products");if(r.ok){const d=await r.json();if(d?.products){if(vivo){setProducts(d.products);setLoading(false)}return}}}catch{}
    await new Promise(r=>setTimeout(r,400*(tentativa+1)));
   }
   if(vivo)setLoading(false)})();
  return()=>{vivo=false}},[]);
 // O botão flutuante só entra depois do hero: ali o CTA principal já está à
 // vista e o flutuante cobriria o texto.
 const [showFloat,setShowFloat]=useState(false);
 useEffect(()=>{const onScroll=()=>setShowFloat(window.scrollY>560);onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
 // Vitrine sem preço: mostra poucos itens só para dar referência visual do trabalho.
 const vitrine=products.filter(p=>p.active!==false&&p.publicVisible!==false&&p.featured&&p.imageUrl).slice(0,6);
 return <main className="lp">
  <header className="lp-topbar">
   <div className="lp-brand"><img src="/logo-orto.jpg" alt="Logo do Laboratório Orto Fernandes"/><div><b>ORTO FERNANDES</b><small>LABORATÓRIO ORTODÔNTICO</small></div></div>
   <a className="lp-topbar-cta" href={CTA_PRINCIPAL} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> <span>Falar agora</span></a>
  </header>

  <section className="lp-hero">
   <div className="lp-hero-text">
    <span className="lp-tag"><Sparkles size={13}/> Atendimento para dentistas e clínicas</span>
    <h1>Aparelhos ortodônticos com precisão e prazo que você pode combinar.</h1>
    <p>Confeccionamos aparelhos sob medida para o seu paciente, com acabamento conferido peça a peça. Busca e entrega em Belém e região.</p>
    <a className="lp-cta" href={CTA_PRINCIPAL} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/><span><b>Solicitar orçamento no WhatsApp</b><small>Resposta rápida, sem compromisso</small></span><ArrowRight size={18}/></a>
    <ul className="lp-hero-checks">
     <li><CheckCircle2 size={15}/> Sob medida para cada caso</li>
     <li><CheckCircle2 size={15}/> Busca e entrega na clínica</li>
     <li><CheckCircle2 size={15}/> Prazo combinado no primeiro contato</li>
    </ul>
   </div>
   <div className="lp-hero-image"><img src="/laboratorio-hero.jpg" alt="Aparelhos ortodônticos produzidos pelo Laboratório Orto Fernandes"/></div>
  </section>

  <section className="lp-proof">
   <div><b>Belém e região</b><span>Atendimento presencial</span></div>
   <div><b>Sob medida</b><span>Cada aparelho é único</span></div>
   <div><b>Peça a peça</b><span>Acabamento conferido</span></div>
   <div><b>WhatsApp</b><span>Contato direto com a equipe</span></div>
  </section>

  {/* Some por inteiro se o catálogo não carregar: melhor não ter a seção do que
      exibir um título com a vitrine vazia. */}
  {(loading||vitrine.length>0)&&<section className="lp-section">
   <div className="lp-section-head"><span className="lp-kicker">NOSSO TRABALHO</span><h2>Alguns aparelhos que produzimos</h2><p>Uma amostra do que sai do laboratório. Fale com a equipe para saber o que se encaixa no seu caso.</p></div>
   <div className="lp-showcase">{loading
    ?Array.from({length:6},(_,i)=><article className="lp-item skeleton" key={i}><div className="lp-item-photo"/><div className="lp-item-body"><small/><b/></div></article>)
    :vitrine.map(p=><article className="lp-item" key={p.id}>
     <div className="lp-item-photo"><img src={p.imageUrl as string} alt={p.name} loading="lazy"/></div>
     <div className="lp-item-body"><small>{p.category.trim()}</small><b>{p.name.trim()}</b>
      <a href={wa(`Olá! Vim pelo site da Orto Fernandes e gostaria de saber sobre “${p.name.trim()}”.`)} target="_blank" rel="noopener noreferrer">Consultar este <ArrowRight size={14}/></a></div>
    </article>)}</div>
   <p className="lp-showcase-note">Produzimos outros modelos além destes. Chame no WhatsApp e conte o que você precisa.</p>
  </section>}

  <section className="lp-section lp-section-soft">
   <div className="lp-section-head"><span className="lp-kicker">POR QUE A ORTO FERNANDES</span><h2>Feito para a rotina de quem atende</h2></div>
   <div className="lp-benefits">{diferenciais.map(({icon:Icon,title,text})=><article key={title}><i><Icon size={19}/></i><b>{title}</b><span>{text}</span></article>)}</div>
  </section>

  <section className="lp-section">
   <div className="lp-section-head"><span className="lp-kicker">COMO FUNCIONA</span><h2>Do primeiro contato à entrega</h2></div>
   <div className="lp-steps">{passos.map(s=><article key={s.n}><span className="lp-step-n">{s.n}</span><b>{s.title}</b><span>{s.text}</span></article>)}</div>
  </section>

  <section className="lp-final">
   <BadgeCheck size={30}/>
   <h2>Vamos conversar sobre o seu próximo caso?</h2>
   <p>Conte qual aparelho você precisa e a equipe responde com as opções e o prazo de produção.</p>
   <a className="lp-cta lp-cta-light" href={CTA_PRINCIPAL} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/><span><b>Chamar no WhatsApp</b><small>98316-0016</small></span><ArrowRight size={18}/></a>
  </section>

  <footer className="lp-footer">
   <div className="lp-footer-brand"><img src="/logo-orto.jpg" alt="Logo do Laboratório Orto Fernandes"/><div><b>Laboratório Orto Fernandes</b><span>Belém e região · 98316-0016</span></div></div>
   <nav><Link href="/bio">Bio</Link><Link href="/catalogo">Catálogo com preços</Link></nav>
  </footer>

  {showFloat&&<a className="lp-float" href={CTA_PRINCIPAL} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp"><MessageCircle size={22}/><span>Falar no WhatsApp</span></a>}
 </main>
}
