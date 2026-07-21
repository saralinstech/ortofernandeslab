"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, BadgeCheck, CircleCheckBig, CircleDashed, Clock3, Cog, Hourglass, MessageSquare, Package, PackageCheck, Pencil, Plus, Save, Trash2, Truck, X } from "lucide-react";
import type { Product } from "../catalog";

type OrderItem = { id?: number; name: string; price: number; quantity: number };
type Client = { id: number; name: string; clinic?: string | null };
export type OrderEventRecord = { id: number; orderId: number; type: string; status?: string | null; content?: string | null; createdBy?: string | null; createdAt: string };
export type OrderRecord = { id: number; customerName: string | null; phone: string | null; items: string; total: number | null; status: string; source: string; createdBy?: string | null; clientId?: number | null; notes?: string | null; updatedAt?: string; createdAt: string };

const statuses = ["Aguardando confirmação", "Confirmado", "Não finalizado", "Em produção", "Pronto", "Saiu para entrega", "Entregue", "Cancelado"];
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusVisual = (status?: string | null) => {
  switch (status) {
    case "Aguardando confirmação": return { icon: <Hourglass/>, className: "waiting" };
    case "Confirmado": return { icon: <BadgeCheck/>, className: "confirmed" };
    case "Não finalizado": return { icon: <CircleDashed/>, className: "unfinished" };
    case "Em produção": return { icon: <Cog/>, className: "production" };
    case "Pronto": return { icon: <PackageCheck/>, className: "ready" };
    case "Saiu para entrega": return { icon: <Truck/>, className: "delivery" };
    case "Entregue": return { icon: <CircleCheckBig/>, className: "delivered" };
    case "Cancelado": return { icon: <Ban/>, className: "cancelled" };
    default: return { icon: <Clock3/>, className: "status" };
  }
};

export default function OrderDetailDrawer({ order, products, clients, events, role, onClose, onSave, onComment }: { order: OrderRecord; products: Product[]; clients: Client[]; events: OrderEventRecord[]; role: "master" | "collaborator"; onClose: () => void; onSave: (data: Record<string, unknown>) => Promise<void>; onComment: (content: string) => Promise<void> }) {
  const [customerName, setCustomerName] = useState(order.customerName || "");
  const [phone, setPhone] = useState(order.phone || "");
  const [clientId, setClientId] = useState(String(order.clientId || ""));
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes || "");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(order.items)); } catch { setItems([]); }
  }, [order.items]);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [items]);
  const orderEvents = events.filter((event) => event.orderId === order.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const save = async () => {
    setSaving(true);
    await onSave({ status, customerName, phone, clientId: clientId || null, notes, items, total, recordEdit: true });
    setSaving(false);
  };
  const addProduct = (productId: string) => {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) return;
    setItems((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
  };
  const sendComment = async () => {
    if (!comment.trim()) return;
    await onComment(comment.trim());
    setComment("");
  };

  return <div className="order-detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="order-detail-drawer">
    <header className="order-detail-header"><div><span className="kicker">PEDIDO OF-{String(order.id).padStart(5, "0")}</span><h2>{order.customerName || "Sem identificação"}</h2><p>Solicitado em {new Date(order.createdAt).toLocaleString("pt-BR")}</p></div><button onClick={onClose} aria-label="Fechar pedido"><X/></button></header>
    <div className="order-detail-grid">
      <section className="order-detail-content">
        <div className="detail-section"><div className="detail-title"><Package/><div><h3>Produtos solicitados</h3><p>Revise os itens, quantidades e valores.</p></div></div><div className="detail-items">{items.map((item, index) => <div className="detail-item" key={`${item.id}-${index}`}><div><b>{item.name}</b><small>{money(Number(item.price || 0))} por unidade</small></div><label>Qtd.<input type="number" min="1" value={item.quantity} onChange={(event) => setItems((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, quantity: Number(event.target.value) } : entry))}/></label><strong>{money(Number(item.price || 0) * item.quantity)}</strong><button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remover ${item.name}`}><Trash2/></button></div>)}</div><label className="add-order-item"><Plus/> Adicionar produto<select value="" onChange={(event) => addProduct(event.target.value)}><option value="">Selecione um produto...</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><div className="detail-total"><span>Total do pedido</span><b>{role === "master" ? money(total) : "Restrito"}</b></div></div>
        <div className="detail-section"><div className="detail-title"><MessageSquare/><div><h3>Dados e observações</h3><p>Informações operacionais deste pedido.</p></div></div><div className="detail-fields"><label>Cliente cadastrado<select value={clientId} onChange={(event) => setClientId(event.target.value)}><option value="">Não vinculado</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}{client.clinic ? ` · ${client.clinic}` : ""}</option>)}</select></label><label>Nome ou clínica<input value={customerName} onChange={(event) => setCustomerName(event.target.value)}/></label><label>WhatsApp<input value={phone} onChange={(event) => setPhone(event.target.value)}/></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label><label className="full">Observações gerais<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Prazo, referência clínica, instruções de entrega..."/></label></div><button className="save-order-detail" onClick={save} disabled={saving}><Save/>{saving ? "Salvando..." : "Salvar alterações"}</button></div>
        <div className="detail-section"><div className="detail-title"><MessageSquare/><div><h3>Registrar ocorrência</h3><p>Adicione informações sobre problemas, contatos ou decisões.</p></div></div><textarea className="comment-box" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ex.: Cliente confirmou o endereço; entrega reagendada para amanhã..."/><button className="add-comment" onClick={sendComment} disabled={!comment.trim()}><Plus/>Adicionar à linha do tempo</button></div>
      </section>
      <aside className="order-timeline"><div className="detail-title"><Clock3/><div><h3>Linha do tempo</h3><p>Histórico completo do pedido.</p></div></div><div className="timeline-list"><article><i className="created"><Package/></i><div><b>Pedido criado</b><p>{order.source === "admin" ? "Lançado pelo administrativo" : "Recebido pelo catálogo"}</p><small>{new Date(order.createdAt).toLocaleString("pt-BR")}</small></div></article>{orderEvents.map((event) => {
        const visual = event.type === "status" ? statusVisual(event.status) : event.type === "comment" ? { icon: <MessageSquare/>, className: "comment" } : { icon: <Pencil/>, className: "edit" };
        return <article key={event.id}><i className={visual.className}>{visual.icon}</i><div><b>{event.type === "status" ? event.status : event.type === "comment" ? "Comentário" : "Pedido editado"}</b><p>{event.content}</p><small>{new Date(event.createdAt).toLocaleString("pt-BR")}{event.createdBy ? ` · ${event.createdBy}` : ""}</small></div></article>;
      })}</div></aside>
    </div>
  </aside></div>;
}
