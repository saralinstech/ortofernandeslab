import type { Product } from "./catalog";

// A primeira chamada à API pode falhar de forma isolada (conexão do banco
// ainda subindo). Sem nova tentativa a tela fica vazia para sempre, então
// insistimos algumas vezes com espera crescente antes de desistir.
export async function fetchProducts(tentativas=3):Promise<Product[]|null>{
 for(let i=0;i<tentativas;i++){
  try{
   const response=await fetch("/api/products");
   if(response.ok){
    const data=await response.json();
    if(Array.isArray(data?.products))return data.products as Product[];
   }
  }catch{}
  if(i<tentativas-1)await new Promise(resolve=>setTimeout(resolve,400*(i+1)));
 }
 return null;
}
