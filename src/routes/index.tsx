import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import SugarOverlay from "../components/SugarOverlay";
import { ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles, TrainFront, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Rua+Tupi+114+Santa+Cecilia+Sao+Paulo";
const cartStorageKey = "bykim-cardapio-cart-v1";
const orderWhatsapp = "https://wa.me/5511913171186?text=" + encodeURIComponent("Olá! Quero fazer uma encomenda pelo site da By Kim.\nData para retirada:\nTamanho ou quantidade:\nSabor:\nObservações:");

const products = [
  {
    name: "Cheesecake Cookies n Cream",
    detail: "",
    price: "R$ 39,00 · fatia",
    image: "/cheese%20cake%20cookie.jpg?v=20261122",
    alt: "Cheesecake Cookies n Cream",
    cheesecake: true,
  },
  {
    name: "Mil Folhas Palmier Baunilha",
    detail: "Massa de palmier formando um mil folhas, com creme de confeiteiro clássico de baunilha",
    price: "R$ 40,04",
    image: "/mil%20folhas.jpg?v=20261122",
    alt: "Mil Folhas Palmier Baunilha",
  },
  {
    name: "Entremet Espresso",
    detail: "Bolo de chocolate regado com café, cremoso de chocolate, mousse de chocolate caramelizado com café",
    price: "R$ 45,50 · fatia",
    image: "/entremet.jpg?v=20261122",
    alt: "Entremet Espresso",
  },
  {
    name: "Torta de Banana",
    detail: "Base de sablé, bolo de amêndoas e laranja, doce de leite, purê de banana, banana fresca e creme de doce de leite",
    price: "R$ 45,50",
    image: "/torta%20banana.jpg?v=20261122",
    alt: "Torta de Banana",
  },
  {
    name: "Sablee com Chocolate de Matchá",
    detail: "Biscoitos amanteigados banhados no chocolate de matchá",
    price: "R$ 36,00",
    image: "/sable%20matcha.jpg?v=20261122",
    alt: "Sablee com Chocolate de Matchá",
  },
  {
    name: "Cheesecake Cumaru",
    detail: "",
    price: "R$ 39,00 · fatia",
    image: "/cheese%20cake%20cumaru.jpg?v=20261122",
    alt: "Cheesecake Cumaru",
    cheesecake: true,
  },
];

function Index() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [cartCount, setCartCount] = useState(0);
  const [storeStatus, setStoreStatus] = useState("Verificando horário...");
  const [headerVisible, setHeaderVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const updateCount = () => { try { const entries = JSON.parse(localStorage.getItem(cartStorageKey) || "[]"); setCartCount(Array.isArray(entries) ? entries.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) : 0); } catch { setCartCount(0); } };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("bykim-cart-updated", updateCount);
    return () => { window.removeEventListener("storage", updateCount); window.removeEventListener("bykim-cart-updated", updateCount); };
  }, []);


  useEffect(() => {
    const updateHours = () => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      const day = parts.find((p) => p.type === "weekday")?.value || "";
      const hour = Number(parts.find((p) => p.type === "hour")?.value || 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value || 0);
      const minutes = hour * 60 + minute;
      const openDay = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(day);
      if (openDay && minutes >= 600 && minutes < 1050) setStoreStatus("Aberto agora · fecha às 17h30");
      else if (openDay && minutes < 600) setStoreStatus("Fechado agora · abrimos às 10h de hoje");
      else if (day === "Mon") setStoreStatus("Fechado agora · abrimos às 10h de terça");
      else setStoreStatus("Fechado agora · abrimos às 10h do próximo dia de funcionamento");
    };
    updateHours();
    const timer = window.setInterval(updateHours, 60000);
    return () => window.clearInterval(timer);
  }, []);


  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) setHeaderVisible(true);
    };
    syncMotionPreference();
    media.addEventListener?.("change", syncMotionPreference);

    if (media.matches) return () => media.removeEventListener?.("change", syncMotionPreference);

    const revealHeader = () => setHeaderVisible(true);
    const onScroll = () => {
      if (window.scrollY > 20) revealHeader();
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 20) revealHeader();
    };
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      const video = videoRef.current;
      if (video && video.paused && !video.ended) void video.play().catch(() => undefined);
    };
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (Math.abs(currentY - touchStartY) > 20) revealHeader();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    const fallback = window.setTimeout(revealHeader, 6000);

    return () => {
      media.removeEventListener?.("change", syncMotionPreference);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.clearTimeout(fallback);
    };
  }, []);


  useLayoutEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const all = Array.from(document.querySelectorAll<HTMLElement>(".bk-page [data-reveal]"));
    const hero = all.filter((element) =>
      element.classList.contains("bk-hero-copy") ||
      element.classList.contains("bk-mobile-hero-copy")
    );
    const observed = all.filter((element) => !hero.includes(element));
    let observer: IntersectionObserver | null = null;

    const setSiblingDelays = () => {
      const maxDelay = window.matchMedia("(max-width: 767px)").matches ? 300 : 450;
      const parents = new Set(observed.map((element) => element.parentElement).filter(Boolean));
      parents.forEach((parent) => {
        const siblings = Array.from(parent!.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute("data-reveal")
        );
        siblings.forEach((element, index) => {
          element.style.setProperty("--reveal-delay", `${Math.min(index * 90, maxDelay)}ms`);
        });
      });
    };

    root.classList.add("js-reveal");
    setSiblingDelays();

    if (reducedMotion.matches) {
      all.forEach((element) => element.classList.add("is-in"));
      all.forEach((element) => element.style.setProperty("--reveal-delay", "0ms"));
      return () => root.classList.remove("js-reveal");
    }

    const heroFrame = window.requestAnimationFrame(() => {
      hero.forEach((element) => {
        element.style.setProperty("--reveal-delay", "300ms");
        element.classList.add("is-in");
      });
    });

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        const rect = element.getBoundingClientRect();
        element.classList.add("is-in");
        window.dispatchEvent(new CustomEvent("sugar:burst", {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, count: 18 },
        }));
        observer?.unobserve(element);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    observed.forEach((element) => observer?.observe(element));

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      observer?.disconnect();
      all.forEach((element) => {
        element.classList.add("is-in");
        element.style.setProperty("--reveal-delay", "0ms");
      });
    };
    const onResize = () => setSiblingDelays();
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(heroFrame);
      observer?.disconnect();
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      window.removeEventListener("resize", onResize);
      root.classList.remove("js-reveal");
    };
  }, []);

  const handleVideoEnded = () => setHeaderVisible(true);
  const handleVideoCanPlay = () => {
    const video = videoRef.current;
    if (video && video.paused && !video.ended) void video.play().catch(() => undefined);
  };

  return (
    <main className="bk-page">
      <SugarOverlay />
      <header className={`bk-header${headerVisible ? " bk-header-visible" : ""}`}>
        <a className="bk-wordmark" href="#inicio" aria-label="By Kim início">
          <span className="bk-mark">BY KIM</span>
          <span className="bk-submark">CONFEITARIA</span>
        </a>
        <nav className="bk-nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#vitrine">Vitrine</a>
          <a href="/cardapio">Cardápio</a>
          <a href="#visite">Visite a By Kim</a>
        </nav>
        <a className="bk-cart-trigger" href="/cardapio" aria-label={`Abrir carrinho, ${cartCount} itens`}><ShoppingBag size={16}/><span>CARRINHO</span><b>{cartCount}</b></a>
        <a className="bk-header-cta" href={whatsapp} target="_blank" rel="noreferrer">PEDIR <ArrowRight size={14} /></a>
      </header>

      <section className={`bk-hero bk-video-hero${reducedMotion ? " bk-video-hero-reduced" : ""}`} id="inicio">
        {!reducedMotion && (
          <video
            ref={videoRef}
            className="bk-hero-video"
            data-sieve-video
            src="/hero-chef.mp4"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/cheese%20cake%20cookie.jpg"
            onEnded={handleVideoEnded}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoEnded}
          />
        )}
        <div className="bk-hero-video-gradient" aria-hidden="true" />
        <div className="bk-hero-copy" data-reveal>
          <h1>Doce, com<br /><em>personalidade.</em></h1>
          <p className="bk-hero-subtitle">Cheesecakes, bolos e doces autorais em Santa Cecília, São Paulo.</p>
        </div>
      </section>

      <section className="bk-mobile-hero-copy" aria-label="Apresentação da By Kim" data-reveal>
        <h1>Doce, com<br /><em>personalidade.</em></h1>
        <p>Cheesecakes, bolos e doces autorais em Santa Cecília, São Paulo.</p>
      </section>

      <section className="bk-location-hours" aria-label="Funcionamento e localização"><p><Clock3 size={15}/>{storeStatus}</p><a href={mapsUrl} target="_blank" rel="noreferrer">COMO CHEGAR <ArrowRight size={14}/></a></section>

      <section className="bk-marquee" aria-label="Especialidades">
        <span>CHEESECAKES</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>BOLOS</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>MIL-FOLHAS</span>
      </section>

      <section className="bk-about" id="sobre">
        
        <div className="bk-about-main">
          
          <h2 data-reveal>A casa<br /><em>By Kim.</em></h2>
          <p className="bk-about-text" data-reveal>Desde 2021, Veronica Kim cria doces com referências coreanas, francesas e brasileiras. Em 2023, a By Kim ganhou uma loja física em Santa Cecília, onde você pode acompanhar a produção de perto.</p>
          <img className="bk-about-photo" src="/sobre.jpg" alt="Veronica Kim na confeitaria By Kim, em Santa Cecília" loading="lazy" width="640" height="800" />
          <a className="bk-underlined" href={instagram} target="_blank" rel="noreferrer">CONHEÇA NO INSTAGRAM <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="bk-showcase" id="vitrine">
        <div className="bk-showcase-head">
          <div><p className="bk-eyebrow" data-reveal>A VITRINE</p><h2 data-reveal>Nossos <em>doces.</em></h2></div>

        </div>
        <div className="bk-product-grid">
          {products.map((product) => (
            <article className="bk-product" key={product.name} data-reveal>
              <a className="bk-product-image" href="/cardapio" target="_blank" rel="noopener noreferrer" aria-label={`Ver ${product.name} no cardápio`}>
                <img src={product.image} alt={product.alt} loading="lazy" />
              </a>
              <div className="bk-product-info">
                <div>
                  <h3>{product.name}</h3>
                  <button className="bk-product-ifood bk-product-cta" type="button" onClick={() => {
                  const name = product.name === "Mil Folhas Palmier Baunilha" ? "Mil Folhas Palmier" : product.name;
                  const amountText = product.price.split("R$")[1]?.trim().split(" ")[0] || "0";
                  const amount = Number(amountText.replace(".", "").replace(",", "."));
                  const cartProduct = { name, price: "R$ " + amount.toFixed(2).replace(".", ","), slice: product.price.toLowerCase().includes("fatia"), category: "Vitrine", description: product.detail || "", flavor: product.cheesecake ? "Composta" : undefined };
                  try {
                    const saved = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
                    const key = name + "::" + (cartProduct.flavor || "");
                    const existing = saved.find((entry: any) => entry.product.name + "::" + (entry.product.flavor || "") === key);
                    const next = existing ? saved.map((entry: any) => entry.product.name + "::" + (entry.product.flavor || "") === key ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...saved, { product: cartProduct, quantity: 1 }];
                    localStorage.setItem(cartStorageKey, JSON.stringify(next));
                    window.dispatchEvent(new Event("bykim-cart-updated"));
                    setCartCount(next.reduce((sum: number, entry: any) => sum + (Number(entry.quantity) || 0), 0));
                  } catch {}
                  window.location.href = "/cardapio";
                }}>ADICIONAR <ArrowRight size={14} /></button>
                </div>
                <span>{product.price}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="bk-showcase-complete">
          <a className="bk-underlined" href="/cardapio" target="_blank" rel="noopener noreferrer">CARDÁPIO COMPLETO <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="bk-order-section" id="encomendas" data-reveal><p className="bk-eyebrow">ENCOMENDAS</p><h2>Encomende seu <em>bolo.</em></h2><p>Bolos e tortas podem ser encomendados para deixar seus momentos ainda mais especiais. Prazo mínimo: <strong>[CONFIRMAR]</strong>.</p><a href={orderWhatsapp} target="_blank" rel="noreferrer">PEDIR ENCOMENDA <ArrowRight size={15}/></a></section>

      <section className="bk-testimonials" hidden><h2>O que dizem os clientes</h2><ul>{[].map((quote, index) => <li key={index}>{quote}</li>)}</ul></section>

      <section className="bk-visit" id="visite">
        <div className="bk-visit-copy">
          <p className="bk-eyebrow" data-reveal>VISITE A BY KIM</p>
          <h2 data-reveal>Feito à mão, em<br /><em>Santa Cecília.</em></h2>
          <p className="bk-visit-description" data-reveal>Desde 2021, Veronica Kim cria doces com referências coreanas, francesas e brasileiras. Em 2023, a By Kim ganhou uma loja física em Santa Cecília, onde você pode acompanhar a produção de perto.</p>
          <div className="bk-visit-facts">
            <p data-reveal><MapPin size={16} /><span>Rua Tupi, 114, Loja 01 · Santa Cecília, São Paulo</span></p>
            <p data-reveal><Clock3 size={16} /><span>Terça a domingo, 10h às 17h30</span></p>
            <p data-reveal><TrainFront size={16} /><span>Estação Santa Cecília, Linha 3-Vermelha</span></p>
          </div>
        </div>
        <div className="bk-visit-map-wrap" data-reveal>
          <iframe
            className="bk-visit-map"
            title="Mapa da By Kim Confeitaria — Rua Tupi, 114, Santa Cecília, São Paulo"
            src="https://www.google.com/maps?q=Rua+Tupi+114+Santa+Cecilia+Sao+Paulo&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <footer className="bk-footer">
        <a className="bk-footer-brand" href="#inicio">BY KIM <span>ㄱ ㅣ ㅁ</span></a>
        
        <div className="bk-footer-links"><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> INSTAGRAM</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WHATSAPP</a></div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>
    </main>
  );
}
