import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles, TrainFront } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";

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
  const [headerVisible, setHeaderVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

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

  const handleVideoEnded = () => setHeaderVisible(true);
  const handleVideoCanPlay = () => {
    const video = videoRef.current;
    if (video && video.paused && !video.ended) void video.play().catch(() => undefined);
  };

  return (
    <main className="bk-page">
      <header className={`bk-header${headerVisible ? " bk-header-visible" : ""}`}>
        <a className="bk-wordmark" href="#inicio" aria-label="By Kim início">
          <span className="bk-mark">BY KIM</span>
          <span className="bk-submark">CONFEITARIA</span>
        </a>
        <nav className="bk-nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#vitrine">Vitrine</a>
          <a href="#visite">Visite a By Kim</a>
        </nav>
        <a className="bk-header-cta" href={whatsapp} target="_blank" rel="noreferrer">PEDIR <ArrowRight size={14} /></a>
      </header>

      <section className={`bk-hero bk-video-hero${reducedMotion ? " bk-video-hero-reduced" : ""}`} id="inicio">
        {!reducedMotion && (
          <video
            ref={videoRef}
            className="bk-hero-video"
            src="/hero-chef.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoEnded}
          />
        )}
        <div className="bk-hero-video-gradient" aria-hidden="true" />
        <div className="bk-hero-copy">
          <h1>Doce, com<br /><em>personalidade.</em></h1>
          <p className="bk-hero-subtitle">Cheesecakes, bolos e doces autorais em Santa Cecília, São Paulo.</p>
        </div>
      </section>

      <section className="bk-marquee" aria-label="Especialidades">
        <span>CHEESECAKES</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>BOLOS</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>MIL-FOLHAS</span>
      </section>

      <section className="bk-about" id="sobre">
        
        <div className="bk-about-main">
          
          <h2>A casa<br /><em>By Kim.</em></h2>
          <p className="bk-about-text">Confeitaria autoral em Santa Cecília.</p>
          <a className="bk-underlined" href={instagram} target="_blank" rel="noreferrer">CONHEÇA NO INSTAGRAM <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="bk-showcase" id="vitrine">
        <div className="bk-showcase-head">
          <div><p className="bk-eyebrow">A VITRINE</p><h2>Nossos <em>doces.</em></h2></div>

        </div>
        <div className="bk-product-grid">
          {products.map((product) => (
            <article className="bk-product" key={product.name}>
              <a className="bk-product-image" href="/cardapio" target="_blank" rel="noopener noreferrer" aria-label={`Ver ${product.name} no cardápio`}>
                <img src={product.image} alt={product.alt} loading="lazy" />
              </a>
              <div className="bk-product-info">
                <div>
                  <h3>{product.name}</h3>
                  {!product.cheesecake && <p>{product.detail}</p>}
                  <a className="bk-product-ifood" href="/cardapio" target="_blank" rel="noopener noreferrer">VER NO CARDÁPIO <ArrowRight size={14} /></a>
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

      <section className="bk-visit" id="visite">
        <div className="bk-visit-copy">
          <p className="bk-eyebrow">VISITE A BY KIM</p>
          <h2>Doce, com<br /><em>personalidade.</em></h2>
          <p className="bk-visit-description">Desde 2021, Veronica Kim cria doces com referências coreanas, francesas e brasileiras. Em 2023, a By Kim ganhou uma loja física em Santa Cecília, onde você pode acompanhar a produção de perto.</p>
          <div className="bk-visit-facts">
            <p><MapPin size={16} /><span>Rua Tupi, 114, Loja 01 · Santa Cecília, São Paulo</span></p>
            <p><Clock3 size={16} /><span>[HORÁRIO CONFIRMADO]</span></p>
            <p><TrainFront size={16} /><span>Estação Santa Cecília, Linha 3-Vermelha</span></p>
          </div>
        </div>
        <div className="bk-visit-map-wrap">
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
