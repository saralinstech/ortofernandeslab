"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { Product } from "../catalog";

// Visualizador de foto usado pelo catálogo e pela bio. A área de ação vem de
// fora porque cada tela oferece algo diferente: o catálogo adiciona ao
// carrinho e mostra o preço, a bio leva ao WhatsApp e não exibe valores.
export default function PhotoViewer({product,onClose,children}:{product:Product;onClose:()=>void;children?:React.ReactNode}){
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};
  document.addEventListener("keydown",onKey);
  const anterior=document.body.style.overflow;
  document.body.style.overflow="hidden";
  return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=anterior};
 },[onClose]);
 const name=product.name.trim();
 return <div className="photo-overlay" role="dialog" aria-modal="true" aria-label={`Foto de ${name}`} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="photo-box">
   <button type="button" className="photo-close" onClick={onClose} aria-label="Fechar foto"><X size={18}/></button>
   <div className="photo-frame">{product.imageUrl?<img src={product.imageUrl} alt={name}/>:<img src="/product-placeholder.png" alt="Imagem ilustrativa do produto"/>}</div>
   <div className="photo-info">
    <div><small>{product.category.trim()}</small><h2>{name}</h2>{product.description&&<p>{product.description}</p>}</div>
    {children&&<div className="photo-actions">{children}</div>}
   </div>
  </div>
 </div>;
}
