import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SugarOverlay from "../components/SugarOverlay";
import { CartButton } from "../components/CartDrawer";
import { showcaseProducts } from "../data/produtos";
import { ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles, TrainFront } from "lucide-react";
import { usePageTitle } from "../hooks/use-page-title";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";

function Index() {
  usePageTitle("By Kim | Confeitaria em Santa Cecília, São Paulo");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
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
      setMotionPreferenceReady(true);
      if (media.matches) {
        setHeaderVisible(true);
        videoRef.current?.pause();
      }
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
        <div className="bk-menu-header-actions"><CartButton /><a className="bk-menu-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Abrir conversa no WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg></a></div>
      </header>

      <section className={`bk-hero bk-video-hero${reducedMotion ? " bk-video-hero-reduced" : ""}`} id="inicio">
        <video
          ref={videoRef}
          className={`bk-hero-video${videoFailed ? " bk-hero-video-failed" : ""}`}
          data-sieve-video
          src={reducedMotion ? undefined : "/hero-chef.mp4"}
          autoPlay={motionPreferenceReady && !reducedMotion}
          muted
          playsInline
          preload={motionPreferenceReady && !reducedMotion ? "metadata" : "none"}
          {...{ fetchPriority: "high" }}
          poster="/hero-chef-poster.jpg"
          onError={() => setVideoFailed(true)}
        />
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
              <Link className="bk-product-image" to="/cardapio" hash={product.id} aria-label={`Ver ${product.name} no cardápio`}>
                <img src={product.image} alt={product.alt} width={4} height={3} loading="lazy" decoding="async" />
              </Link>
              <div className="bk-product-info">
                <div>
                  <h3>{product.name}</h3>
                  <Link className="bk-product-ifood" to="/cardapio" hash={product.id} aria-label={`Ver ${product.name} no cardápio`}>VER NO CARDÁPIO <ArrowRight size={14} /></Link>
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
