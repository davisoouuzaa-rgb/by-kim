import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const formatMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const whatsapp = "https://wa.me/5511913171186?text=";

export function CartButton() {
  const { count, isOpen, openCart, closeCart } = useCart();
  return <>
    <button className="bk-cart-trigger" type="button" onClick={openCart} aria-label={`Abrir carrinho, ${count} itens`}>
      <ShoppingBag size={17} /><span>CARRINHO</span><b>{count}</b>
    </button>
    {isOpen && <CartDrawer onClose={closeCart} />}
  </>;
}

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, count, subtotal, setQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);
  const message = useMemo(() => [
    "Olá! Vim pelo site da By Kim e quero pedir:",
    ...items.map((item) => `- ${item.quantity}x ${item.name}${item.unit === "fatia" ? " (fatia)" : ""}${item.option ? ` - ${item.option}` : ""}`),
    `Total: ${formatMoney(subtotal)}`,
    ...(name.trim() ? [`Nome: ${name.trim()}`] : []),
    ...(notes.trim() ? [`Observações: ${notes.trim()}`] : []),
  ].join("\n"), [items, subtotal, name, notes]);

  return <div className="bk-overlay bk-cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="bk-cart-drawer" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <header className="bk-cart-heading"><div><p className="bk-eyebrow">BY KIM</p><h2>Sua sacola <span>({count})</span></h2></div><button className="bk-panel-close" type="button" aria-label="Fechar carrinho" onClick={onClose}><X size={20} /></button></header>
      {items.length === 0 ? <div className="bk-cart-empty"><ShoppingBag size={32} strokeWidth={1.2} /><h3>Seu carrinho está vazio</h3><button type="button" className="bk-modal-primary" onClick={onClose}>CONTINUAR COMPRANDO</button><button type="button" className="bk-modal-primary bk-cart-checkout" disabled>ENVIAR PEDIDO PELO WHATSAPP</button></div> : <>
        <div className="bk-cart-content"><div className="bk-cart-items">
          {items.map((item) => <article className="bk-cart-item" key={item.id + (item.option ?? "")}>
            <div className="bk-cart-item-info"><h3>{item.name}{item.option ? ` - ${item.option}` : ""}</h3><p>{formatMoney(item.unitPrice)} · {item.unit}</p><strong>{formatMoney(item.unitPrice * item.quantity)}</strong></div>
            <div className="bk-cart-item-actions"><div className="bk-quantity-control">
              <button type="button" aria-label={`Diminuir ${item.name}`} onClick={() => setQuantity(item.id, item.option, item.quantity - 1)}><Minus size={13} /></button>
              <strong>{item.quantity}</strong>
              <button type="button" aria-label={`Aumentar ${item.name}`} onClick={() => setQuantity(item.id, item.option, item.quantity + 1)}><Plus size={13} /></button>
            </div><button type="button" className="bk-remove-item" onClick={() => removeItem(item.id, item.option)} aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button></div>
          </article>)}
        </div>
        <div className="bk-cart-fields">
          <label>Seu nome <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Opcional" /></label>
          <label>Observações <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Alguma observação para o pedido?" rows={2} /></label>
        </div></div>
        <div className="bk-cart-footer">
          <div className="bk-cart-total"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div><div className="bk-cart-total"><span>Total</span><strong>{formatMoney(subtotal)}</strong></div>
          <a className="bk-modal-primary bk-cart-checkout" href={whatsapp + encodeURIComponent(message)} target="_blank" rel="noopener noreferrer">ENVIAR PEDIDO PELO WHATSAPP <ArrowRight size={16} /></a>
          <button className="bk-cart-clear" type="button" onClick={() => { if (window.confirm("Deseja esvaziar o carrinho?")) clear(); }}>ESVAZIAR CARRINHO</button>
        </div>
      </>}
    </aside>
  </div>;
}
