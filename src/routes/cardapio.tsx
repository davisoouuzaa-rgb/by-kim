import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, MessageCircle, X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CartButton } from "../components/CartDrawer";
import { categories, catalogProducts } from "../data/produtos";

export const Route = createFileRoute("/cardapio")({ component: Cardapio });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const phone = "5511913171186";
const whatsappBase = `https://wa.me/${phone}?text=`;

type Product = { id: string; name: string; description?: string; price: string; slice?: boolean; category: string; flavor?: string | undefined; image?: string | undefined };
const allProducts: Product[] = catalogProducts.map((item) => ({ id: item.id, name: item.name, description: item.description, price: item.priceText, slice: item.slice, category: item.category, image: item.image }));
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const cents = (price: string) => Math.round(Number(price.replace("R$", "").trim().replace(".", "").replace(",", ".")) * 100);
const cheesecakeNames = ["Cheesecake Original", "Cheesecake Cookies n Cream", "Cheesecake Cumaru", "Cheesecake de Trufas"];
const cheesecakeOptions = ["Composta Goiabada Morango", "Goiabada", "Morango"];
const sableOptions = ["Chocolate meio amargo", "Chocolate branco", "Chocolate de matchá"];
const hasFlavor = (product: Product) => cheesecakeNames.includes(product.name) || product.name === "Presente Sable";
const optionsFor = (product: Product) => product.name === "Presente Sable" ? sableOptions : cheesecakeOptions;

function Cardapio() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [closingSelected, setClosingSelected] = useState(false);
  const [panelSide, setPanelSide] = useState<"right" | "left">("right");
  const [coveredIndex, setCoveredIndex] = useState<number | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{ product: Product; flavor: string; trigger: HTMLButtonElement } | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [flavorSelections, setFlavorSelections] = useState<Record<string, string>>({});
  const [selectedFlavor, setSelectedFlavor] = useState("Composta");
  const { addItem, openCart } = useCart();
  const gridPositionsRef = useRef<Map<HTMLElement, Map<HTMLElement, DOMRect>>>(new Map());
  const animateGridRef = useRef(false);

  const openProduct = useCallback((product: Product, flavor: string, trigger: HTMLButtonElement) => {
    const grid = trigger.closest(".bk-menu-grid");
    const cards = grid ? Array.from(grid.querySelectorAll<HTMLElement>(":scope > .bk-menu-item")) : [];
    const current = trigger.closest<HTMLElement>(".bk-menu-item");
    const index = current ? cards.indexOf(current) : -1;
    const rect = current?.getBoundingClientRect();
    const gridRect = grid?.getBoundingClientRect();
    const isAtRightEdge = Boolean(rect && gridRect && rect.right >= gridRect.right - 2);
    const sameRow = rect ? cards.map((card, i) => ({ card, i, rect: card.getBoundingClientRect() })).filter((entry) => Math.abs(entry.rect.top - rect.top) < 2) : [];
    const position = sameRow.findIndex((entry) => entry.i === index);
    const next = sameRow[position + 1];
    const previous = sameRow[position - 1];
    if (isAtRightEdge || (!next && previous)) {
      setPanelSide("left");
      setCoveredIndex(previous?.i ?? null);
    } else if (next) {
      setPanelSide("right");
      setCoveredIndex(next.i);
    } else {
      setPanelSide("right");
      setCoveredIndex(null);
    }
    animateGridRef.current = true;
    setSelected(product);
    setSelectedFlavor(flavor);
    setProductQty(1);
    setAddedFeedback(false);
    setClosingSelected(false);
  }, []);

  const closeProduct = useCallback(() => {
    if (selected && !closingSelected) setClosingSelected(true);
  }, [selected, closingSelected]);

  useEffect(() => {
    if (!closingSelected) return;
    const timeout = window.setTimeout(() => {
      const nextSelection = pendingSelection;
      animateGridRef.current = true;
      setSelected(null);
      setPendingSelection(null);
      setCoveredIndex(null);
      setProductQty(1);
      setAddedFeedback(false);
      setClosingSelected(false);
      if (nextSelection) openProduct(nextSelection.product, nextSelection.flavor, nextSelection.trigger);
    }, 240);
    return () => window.clearTimeout(timeout);
  }, [closingSelected, pendingSelection, openProduct]);

  useLayoutEffect(() => {
    const grids = Array.from(document.querySelectorAll<HTMLElement>(".bk-menu-grid"));
    const nextPositions = new Map<HTMLElement, Map<HTMLElement, DOMRect>>();

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>(":scope > .bk-menu-item"));
      const previous = gridPositionsRef.current.get(grid);
      const current = new Map<HTMLElement, DOMRect>();

      cards.forEach((card) => current.set(card, card.getBoundingClientRect()));

      if (animateGridRef.current && previous) {
        cards.forEach((card) => {
          const before = previous.get(card);
          const after = current.get(card);
          if (!before || !after) return;
          const dx = before.left - after.left;
          const dy = before.top - after.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

          card.style.transition = "none";
          card.style.transform = `translate(${dx}px, ${dy}px)`;
          requestAnimationFrame(() => {
            card.style.transition = "transform 350ms cubic-bezier(.22,1,.36,1)";
            card.style.transform = "translate(0, 0)";
            window.setTimeout(() => {
              card.style.transition = "";
              card.style.transform = "";
            }, 370);
          });
        });
      }

      nextPositions.set(grid, current);
    });

    gridPositionsRef.current = nextPositions;
    animateGridRef.current = false;
  }, [selected, closingSelected]);

  useEffect(() => {
    if (!selected) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".bk-menu-purchase-panel") || target?.closest(".bk-menu-item-open")) return;
      closeProduct();
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeProduct(); };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, closeProduct]);

  useEffect(() => {
    if (!addedFeedback) return;
    const timeout = window.setTimeout(() => setAddedFeedback(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [addedFeedback]);

  const addToCart = (product: Product, quantity: number, shouldOpenCart = true) => {
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: cents(product.price) / 100,
      unit: product.slice ? "fatia" : "unidade",
      ...(product.flavor ? { option: product.flavor } : {}),
    }, quantity);
    if (shouldOpenCart) {
      setSelected(null);
      setClosingSelected(false);
      setCoveredIndex(null);
      setProductQty(1);
      openCart();
    }
  };

  return (
    <main className="bk-page bk-menu-page">
      <div className="bk-topline">DOCES FORA DA CAIXA</div>
      <header className="bk-header bk-menu-header">
        <Link className="bk-wordmark" to="/" aria-label="By Kim início">
          <span className="bk-mark">By Kim</span>
          <span className="bk-submark">CONFEITARIA</span>
        </Link>
        <Link className="bk-menu-back" to="/">← VOLTAR AO SITE</Link>
        <div className="bk-menu-header-actions">
          <CartButton />
          <a className="bk-header-cta" href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer">PEDIR <ArrowRight size={14} /></a>
        </div>
      </header>

      <section className="bk-menu-intro">
        <p className="bk-eyebrow"><span /> BY KIM</p>
        <h1>Cardápio</h1>
        <p>Doce, com personalidade.</p>
      </section>

      <div className="bk-menu-categories">
        {categories.map((category) => (
          <section className="bk-menu-category" key={category.name}>
            <div className="bk-menu-category-heading">
              <h2>{category.name}</h2>
            </div>
            <div className="bk-menu-grid">
              {category.items.map((item, itemIndex) => {
                const product = allProducts.find((entry) => entry.name === item.name)!;
                const flavored = hasFlavor(product);
                const productOptions = optionsFor(product);
                const flavor = flavored ? (flavorSelections[item.name] ?? productOptions[0]) : undefined;
                const listingProduct = flavored ? { ...product, flavor } : product;
                const expanded = selected?.name === product.name;
                const isCovered = Boolean(selected && selected.category === product.category && coveredIndex === itemIndex && !expanded);
                const activeProduct = flavored ? { ...product, flavor: selectedFlavor } : product;
                return (
                  <article
                    className={`bk-menu-item bk-menu-item-button${expanded ? " bk-menu-item-expanded" : ""}${expanded && closingSelected ? " bk-menu-item-closing" : ""}${isCovered ? " bk-menu-item-covered" : ""}${isCovered && closingSelected ? " bk-menu-item-covered-closing" : ""}`}
                    key={item.name}
                    aria-hidden={isCovered ? true : undefined}
                  >
                    <button
                      className="bk-menu-item-copy bk-menu-item-open"
                      type="button"
                      aria-expanded={expanded && !closingSelected}
                      disabled={isCovered}
                      onClick={(event) => {
                        if (expanded) { closeProduct(); return; }
                        if (selected) {
                          setPendingSelection({ product: listingProduct, flavor: flavor ?? "Composta", trigger: event.currentTarget });
                          setClosingSelected(true);
                          return;
                        }
                        openProduct(listingProduct, flavor ?? "Composta", event.currentTarget);
                      }}
                    >
                      {product.image && <img className="bk-menu-product-image" src={product.image} alt={item.name} loading="lazy" />}
                      <span className="bk-menu-item-title">{item.name}</span>
                      {item.description && <span className="bk-menu-item-description">{item.description}</span>}
                    </button>
                    {expanded && (
                      <div className={`bk-menu-purchase-panel bk-menu-purchase-panel-${panelSide}${closingSelected ? " bk-menu-purchase-panel-closing" : ""}`} role="dialog" aria-label={`Comprar ${product.name}`}>
                        <button className="bk-menu-inline-close" type="button" aria-label="Fechar detalhes" onClick={closeProduct}><X size={20} /></button>
                        <div className="bk-menu-purchase-scroll">
                          <p className="bk-eyebrow"><span /> {product.category.toUpperCase()}</p>
                          <h3>{product.name}</h3>
                          {product.slice && <p className="bk-product-serving">Serve 1 pessoa</p>}
                          {product.description && <p className="bk-product-description">{product.description}</p>}
                          {flavored && <div className="bk-flavor-picker bk-flavor-picker-detail" aria-label="Escolha a opção">{productOptions.map((option) => <button type="button" key={option} className={selectedFlavor === option ? "active" : ""} onClick={() => { setSelectedFlavor(option); setFlavorSelections((current) => ({ ...current, [item.name]: option })); }}>{option}</button>)}</div>}
                          <div className="bk-product-modal-price">{product.price}{product.slice && <span> · fatia</span>}</div>
                          <div className="bk-quantity-row">
                            <span>Quantidade</span>
                            <div className="bk-quantity-control bk-menu-quantity-control">
                              <button type="button" aria-label="Diminuir quantidade" onClick={() => setProductQty((q) => Math.max(1, q - 1))}><Minus size={17} /></button>
                              <strong>{productQty}</strong>
                              <button type="button" aria-label="Aumentar quantidade" onClick={() => setProductQty((q) => q + 1)}><Plus size={17} /></button>
                            </div>
                          </div>
                          <button className="bk-modal-primary bk-menu-add-primary" type="button" onClick={() => { addToCart(flavored ? activeProduct : product, productQty, false); setAddedFeedback(true); }}>{addedFeedback ? "ADICIONADO ✓" : `ADICIONAR · ${money(cents(product.price) * productQty / 100)}`}</button>
                          <div className="bk-menu-purchase-separator" />
                        </div>
                      </div>
                    )}
                    <>
                      {flavored && <div className="bk-flavor-picker bk-flavor-picker-list" aria-label="Opção">
                        {productOptions.map((option) => <button type="button" key={option} className={flavor === option ? "active" : ""} onClick={() => setFlavorSelections((current) => ({ ...current, [item.name]: option }))}>{option}</button>)}
                      </div>}
                      <span className="bk-menu-item-bottom">
                        <span className="bk-menu-price"><strong>{item.price}</strong>{item.slice && <small>fatia</small>}</span>
                        <button type="button" className="bk-menu-add" onClick={() => addToCart(listingProduct, 1)}>ADICIONAR</button>

                      </span>
                    </>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="bk-menu-allergens">Alérgenos: consulte a loja antes de pedir.</p>

      <footer className="bk-footer bk-menu-footer">
        <Link className="bk-footer-brand" to="/">By Kim <span>CONFEITARIA</span></Link>
        <div className="bk-footer-links">
          <a href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> INSTAGRAM</a>
          <a href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WHATSAPP</a>
        </div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>



    </main>
  );
}
