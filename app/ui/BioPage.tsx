"use client";
import { useEffect,useState } from "react";
import { ArrowRight,BadgeCheck,Instagram,MapPin,Maximize2 } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { Product } from "../catalog";
import { fetchProducts } from "../fetch-products";
import PhotoViewer from "./PhotoViewer";
const phone="5591983160016";
const wa=(message:string)=>`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
const INSTAGRAM_USER="ortofernandeslab";
const INSTAGRAM=`https://instagram.com/${INSTAGRAM_USER}`;
export default function BioPage(){const [products,setProducts]=useState<Product[]>([]);const [photo,setPhoto]=useState<Product|null>(null);useEffect(()=>{let vivo=true;fetchProducts().then(lista=>{if(vivo&&lista)setProducts(lista)});return()=>{vivo=false}},[]);const featured=products.filter(p=>p.active!==false&&p.publicVisible!==false&&p.featured).slice(0,8);return <main className="bio-page"><div className="bio-shell">
 <header className="bio-cover"><img src="/laboratorio-hero.jpg" alt="Aparelhos ortodônticos produzidos pelo Laboratório Orto Fernandes"/><div className="cover-shade"/></header>
 <section className="bio-profile"><div className="bio-avatar"><img src="/logo-orto.jpg" alt="Logo do Laboratório Orto Fernandes"/></div><h1>Orto Fernandes</h1><p className="bio-copy">Aparelhos ortodônticos feitos com precisão, acabamento e cuidado para dentistas e clínicas.</p><div className="bio-meta"><span><MapPin size={13}/> Belém e região</span><span><BadgeCheck size={13}/> Atendimento especializado</span></div></section>
 <section className="bio-actions"><a className="bio-secondary-action" href={wa("Olá! Vim pelo Instagram da Orto Fernandes e gostaria de falar com a equipe.")} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/><span><b>Falar com a equipe</b><small>Atendimento pelo WhatsApp</small></span><ArrowRight size={17}/></a></section>
 <section className="bio-products"><div className="bio-section-title"><div><span>CONHEÇA NOSSO TRABALHO</span><h2>Aparelhos em destaque</h2></div></div><div className="bio-product-list">{featured.map((p,i)=><article className="bio-product" key={p.id}><button type="button" className={`product-photo product-photo-${i%3}`} onClick={()=>setPhoto(p)} aria-label={`Ver foto de ${p.name}`}>{p.imageUrl?<img src={p.imageUrl} alt={p.name}/>:<img src="/product-placeholder.png" alt="Imagem ilustrativa do produto"/>}<span className="zoom-hint"><Maximize2 size={15}/></span></button><div className="bio-product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><a href={wa(`Olá! Vim pelo Instagram da Orto Fernandes e gostaria de solicitar o produto “${p.name}”. Poderia me passar mais informações?`)} target="_blank">Solicitar informações <ArrowRight size={14}/></a></div></article>)}</div></section>
 <section className="about-strip"><span>DESDE O PRIMEIRO CONTATO</span><h2>Excelência em cada detalhe.</h2><p>Trabalhamos em parceria com profissionais para entregar aparelhos com acabamento, precisão e agilidade.</p></section>
 <footer className="bio-footer"><div className="footer-logo"><img src="/logo-orto.jpg" alt="Logo do Laboratório Orto Fernandes"/></div><p>Laboratório Orto Fernandes</p><span className="footer-social"><a href={wa("Olá! Vim pela bio da Orto Fernandes e gostaria de falar com a equipe.")} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp"><WhatsAppIcon size={17}/></a><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label={`Instagram @${INSTAGRAM_USER}`}><Instagram size={17}/></a></span></footer>
 {photo&&<PhotoViewer product={photo} onClose={()=>setPhoto(null)}>
  <a className="photo-wa" href={wa(`Olá! Vim pelo Instagram da Orto Fernandes e gostaria de solicitar o produto “${photo.name.trim()}”. Poderia me passar mais informações?`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={17}/> Solicitar informações</a>
 </PhotoViewer>}
 </div></main>}
