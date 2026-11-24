import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RefObject } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const formatMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const whatsapp = "https://wa.me/5511913171186?text=";

export function CartButton() {
  const { count, isOpen, openCart, closeCart } = useCart();
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={triggerRef} className="bk-cart-trigger" type="button" onClick={openCart} aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`}>
      <ShoppingBag size={17} /><span>CARRINHO</span><b aria-hidden="true">{count}</b>
      <span className="bk-sr-only" aria-live="polite" aria-atomic="true">Carrinho: {count} {count === 1 ? "item" : "itens"}</span>
    </button>
    {isOpen && <CartDrawer onClose={closeCart} returnFocusRef={triggerRef} />}
  </>;
}

export function CartDrawer({ onClose, returnFocusRef }: { onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  const { items, count, subtotal, setQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const host = document.createElement("div");
    host.setAttribute("data-cart-portal", "");
    document.body.appendChild(host);
    setPortalHost(host);
    const page = document.querySelector<HTMLElement>(".bk-page");
    const previousInert = page?.inert ?? false;
    const previousAriaHidden = page?.getAttribute("aria-hidden");
    if (page) {
      page.inert = true;
      page.setAttribute("aria-hidden", "true");
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (page) {
        page.inert = previousInert;
        if (previousAriaHidden === null) page.removeAttribute("aria-hidden");
        else page.setAttribute("aria-hidden", previousAriaHidden);
      }
      document.body.style.overflow = previousOverflow;
      host.remove();
      returnFocusRef.current?.focus();
    };
  }, [returnFocusRef]);

  useEffect(() => {
    if (!portalHost) return;
    titleRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) {
        event.preventDefault();
        titleRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [portalHost, onClose]);
  const message = useMemo(() => [
    "Olá! Vim pelo site da By Kim e quero pedir:",
    ...items.map((item) => `- ${item.quantity}x ${item.name}${item.unit === "fatia" ? " (fatia)" : ""}${item.option ? ` - ${item.option}` : ""}`),
    `Total: ${formatMoney(subtotal)}`,
    ...(name.trim() ? [`Nome: ${name.trim()}`] : []),
    ...(notes.trim() ? [`Observações: ${notes.trim()}`] : []),
  ].join("\n"), [items, subtotal, name, notes]);

  if (!portalHost) return null;

  return createPortal(<div className="bk-overlay bk-cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside ref={dialogRef} className="bk-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="bk-cart-dialog-title">
      <header className="bk-cart-heading"><div><p className="bk-eyebrow">BY KIM</p><h2 ref={titleRef} tabIndex={-1}><span id="bk-cart-dialog-title" className="bk-sr-only">Seu pedido</span>Sua sacola <span>({count})</span></h2></div><button className="bk-panel-close" type="button" aria-label="Fechar carrinho" onClick={onClose}><X size={20} /></button></header>
      {items.length === 0 ? <div className="bk-cart-empty"><ShoppingBag size={32} strokeWidth={1.2} /><h3>Seu carrinho está vazio</h3><button type="button" className="bk-modal-primary" onClick={onClose}>CONTINUAR COMPRANDO</button><button type="button" className="bk-modal-primary bk-cart-checkout" disabled>ENVIAR PEDIDO PELO WHATSAPP</button></div> : <>
        <div className="bk-cart-content"><div className="bk-cart-items">
          {items.map((item) => <article className="bk-cart-item" key={item.id + (item.option ?? "")}>
            <div className="bk-cart-item-info"><h3>{item.name}{item.option ? ` - ${item.option}` : ""}</h3><p>{formatMoney(item.unitPrice)} · {item.unit}</p><strong>{formatMoney(item.unitPrice * item.quantity)}</strong></div>
            <div className="bk-cart-item-actions"><div className="bk-quantity-control">
              <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => setQuantity(item.id, item.option, item.quantity - 1)}><Minus size={13} /></button>
              <strong>{item.quantity}</strong>
              <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setQuantity(item.id, item.option, item.quantity + 1)}><Plus size={13} /></button>
            </div><button type="button" className="bk-remove-item" onClick={() => removeItem(item.id, item.option)} aria-label={`Remover ${item.name} do pedido`}><Trash2 size={15} /></button></div>
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
  </div>, portalHost);
}
