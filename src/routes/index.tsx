import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SugarOverlay from "../components/SugarOverlay";
import { CartButton } from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { showcaseProducts } from "../data/produtos";
import { ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles, TrainFront } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";

function Index() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { addItem } = useCart();
  const [optionSelections, setOptionSelections] = useState<Record<string, string>>({});
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const heroTextTimer = window.setTimeout(() => setHeroTextVisible(true), 1000);
    return () => window.clearTimeout(heroTextTimer);
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
      element.classList.contains("bk-hero-copy")
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
      observer?.disconnect();
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      window.removeEventListener("resize", onResize);
      root.classList.remove("js-reveal");
    };
  }, []);

  return (
    <main className="bk-page">
      <SugarOverlay />
      <header className={`bk-header${headerVisible ? " bk-header-visible" : ""}`}>
        <Link className="bk-wordmark" to="/" hash="inicio" aria-label="By Kim início">
          <span className="bk-mark">BY KIM</span>
          <span className="bk-submark">CONFEITARIA</span>
        </Link>
        <nav className="bk-nav" aria-label="Navegação principal">
          <Link to="/" hash="sobre">Sobre</Link>
          <Link to="/" hash="vitrine">Vitrine</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/" hash="visite">Visite a By Kim</Link>
        </nav>
        <div className="bk-menu-header-actions"><CartButton /><a className="bk-header-cta" href={whatsapp} target="_blank" rel="noreferrer">PEDIR <ArrowRight size={14} /></a></div>
      </header>

      <section className={`bk-hero bk-video-hero${reducedMotion ? " bk-video-hero-reduced" : ""}`} id="inicio">
        {!reducedMotion && (
          <video
            ref={videoRef}
            className="bk-hero-video"
            data-sieve-video
            src="/hero-chef.mp4"
            autoPlay={!reducedMotion}
            muted
            playsInline
            preload="auto"
            fetchPriority="high"
            poster="/hero-chef-poster.jpg"
          />
        )}
        <div className="bk-hero-video-gradient" aria-hidden="true" />
        <div className={`bk-hero-copy${heroTextVisible ? " is-in" : ""}`}>
          <h1>Doce, com<br /><em>personalidade.</em></h1>
          <p className="bk-hero-subtitle">Cheesecakes, bolos e doces autorais em Santa Cecília, São Paulo.</p>
        </div>
      </section>

      <section className="bk-mobile-hero-copy" aria-label="Apresentação da By Kim" data-reveal>
        <h1>Doce, com<br /><em>personalidade.</em></h1>
        <p>Cheesecakes, bolos e doces autorais em Santa Cecília, São Paulo.</p>
      </section>

      <section className="bk-marquee" aria-label="Especialidades">
        <span>CHEESECAKES</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>BOLOS</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>MIL-FOLHAS</span>
      </section>

      <section className="bk-about" id="sobre">
        
        <div className="bk-about-main">
          
          <h2 data-reveal>A casa<br /><em>By Kim.</em></h2>
          <p className="bk-about-text" data-reveal>Confeitaria autoral em Santa Cecília.</p>
          <a className="bk-underlined" href={instagram} target="_blank" rel="noreferrer">CONHEÇA NO INSTAGRAM <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="bk-showcase" id="vitrine">
        <div className="bk-showcase-head">
          <div><p className="bk-eyebrow" data-reveal>A VITRINE</p><h2 data-reveal>Nossos <em>doces.</em></h2></div>

        </div>
        <div className="bk-product-grid">
          {showcaseProducts.map((product) => (
            <article className="bk-product" key={product.name} data-reveal>
              <Link className="bk-product-image" to="/cardapio" aria-label={`Ver ${product.name} no cardápio`}>
                <img src={product.image} alt={product.alt} loading="lazy" />
              </Link>
              <div className="bk-product-info">
                <div>
                  <h3>{product.name}</h3>
                  {product.optionGroup === "cheesecake" && <div className="bk-flavor-picker" aria-label="Escolha a cobertura">{["Composta Goiabada Morango", "Goiabada", "Morango"].map((option) => <button type="button" key={option} className={(optionSelections[product.id] ?? "Composta Goiabada Morango") === option ? "active" : ""} onClick={() => setOptionSelections((current) => ({ ...current, [product.id]: option }))}>{option}</button>)}</div>}
                  <button className="bk-product-ifood" type="button" onClick={() => addItem({ id: product.id, name: product.name, unitPrice: product.price, unit: product.unit, option: product.optionGroup ? (optionSelections[product.id] ?? "Composta Goiabada Morango") : undefined })}>ADICIONAR <ArrowRight size={14} /></button>
                </div>
                <span>{product.displayPrice}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="bk-showcase-complete">
          <Link className="bk-underlined" to="/cardapio">CARDÁPIO COMPLETO <ArrowRight size={15} /></Link>
        </div>
      </section>

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
        <Link className="bk-footer-brand" to="/" hash="inicio">BY KIM <span>ㄱ ㅣ ㅁ</span></Link>
        
        <div className="bk-footer-links"><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> INSTAGRAM</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WHATSAPP</a></div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>
    </main>
  );
}
