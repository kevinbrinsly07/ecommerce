import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import placeholder from "../assets/placeholder.png";
import {
  FiTruck,
  FiLock,
  FiRotateCcw,
  FiHeadphones,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import item1 from "../assets/item1.jpg";
import item2 from "../assets/item2.jpg";
import item3 from "../assets/item3.jpg";
import Footer from "./Footer";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel
  const heroSlides = [
    {
      id: "hero-1",
      title: "Seasonal Sale",
      subtitle: "Up to 40% off select styles",
      cta: "Shop Sale",
      href: "/products",
      img: item1,
    },
    {
      id: "hero-2",
      title: "New Arrivals",
      subtitle: "Fresh drops for modern living",
      cta: "Explore",
      href: "/products",
      img: item2,
    },
    {
      id: "hero-3",
      title: "Editor's Picks",
      subtitle: "Curated favorites this week",
      cta: "View Picks",
      href: "/products",
      img: item3,
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimer = useRef(null);

  // Featured rail ref (horizontal carousel)
  const featuredRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(heroTimer.current);
  }, [heroSlides.length]);

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (img.includes("via.placeholder.com")) return placeholder;
    if (img.includes("picsum.photos")) return placeholder;
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return placeholder;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top hero */}
      <section className="bg-[radial-gradient(circle_at_top,#1f2937,#020617)]/90 border-b border-slate-900/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          {/* Left side */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 mb-6 shadow-sm shadow-slate-900/40">
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-100">
                NEW DROPS
              </span>
              <span className="text-[0.6rem] text-slate-400">|</span>
              <span className="text-[0.6rem] text-slate-300">
                Up to 40% off this week
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              EBucket <br /> Curated looks for modern living.
            </h1>
            <p className="text-slate-300 max-w-xl mb-6">
              Discover trending fashion, gadgets, and home decor from trusted
              brands. Fast delivery, secure checkout, effortless returns.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-1 rounded-full bg-slate-100/95 text-slate-950 px-5 py-2.5 font-semibold shadow-lg shadow-slate-950/30 hover:bg-white transition"
              >
                Shop now <span aria-hidden>→</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 rounded-full border border-slate-700 text-slate-100 px-4 py-2 font-medium bg-slate-900/40 hover:bg-slate-900/70 transition"
              >
                Create account
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-600"></div>
                <div>
                  <p className="text-xs text-slate-400">Trusted by over</p>
                  <p className="text-sm font-semibold text-slate-50">
                    12,400+ shoppers
                  </p>
                </div>
              </div>
            </div>
            {/* Stat bar */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { label: "New arrivals", value: "120+" },
                { label: "5-star reviews", value: "3.2k" },
                { label: "Avg. delivery", value: "2-4 days" },
              ].map((item, i) => (
                <div key={i} className="min-w-26">
                  <p className="text-2xl font-semibold text-slate-50">
                    {item.value}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side hero carousel */}
          <div className="relative rounded-2xl overflow-hidden min-h-80 shadow-xl bg-slate-900/40 border border-slate-800">
            {/* Slides as backgrounds */}
            {heroSlides.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                  idx === heroIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${s.img})` }}
              />
            ))}
            <div className="absolute inset-0 bg-slate-950/70"></div>
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/60">
                  Featured
                </p>
                <h2 className="text-xl font-bold mt-1">
                  {heroSlides[heroIndex].title}
                </h2>
                <p className="text-sm text-white/60 mt-2 max-w-xs">
                  {heroSlides[heroIndex].subtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  to={heroSlides[heroIndex].href}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-950 px-4 py-2 text-sm font-semibold hover:bg-white transition"
                >
                  {heroSlides[heroIndex].cta} <span aria-hidden>→</span>
                </Link>
                {/* Controls */}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() =>
                      setHeroIndex(
                        (i) => (i - 1 + heroSlides.length) % heroSlides.length
                      )
                    }
                    className="w-9 h-9 rounded-full bg-slate-900/60 border border-slate-700 hover:bg-slate-900/80 flex items-center justify-center"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setHeroIndex((i) => (i + 1) % heroSlides.length)
                    }
                    className="w-9 h-9 rounded-full bg-slate-900/60 border border-slate-700 hover:bg-slate-900/80 flex items-center justify-center"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === heroIndex ? "w-6 bg-slate-100" : "w-3 bg-slate-500/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-slate-950/30 border-b border-slate-900/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 justify-between">
          {[
            {
              title: "Free shipping over $50",
              desc: "Fast, tracked delivery",
              icon: <FiTruck className="text-slate-100 text-xl" />,
            },
            {
              title: "Secure payments",
              desc: "SSL, 3D secure supported",
              icon: <FiLock className="text-slate-100 text-xl" />,
            },
            {
              title: "30-day returns",
              desc: "No questions asked",
              icon: <FiRotateCcw className="text-slate-100 text-xl" />,
            },
            {
              title: "24/7 support",
              desc: "Chat with our team",
              icon: <FiHeadphones className="text-slate-100 text-xl" />,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 min-w-48">
              <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-linear-to-br from-slate-100/10 via-slate-100/5 to-slate-100/0 border border-slate-700/60 shadow-inner">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400 mb-1">
              Featured
            </p>
            <h2 className="text-xl font-bold text-white">Best picks for you</h2>
          </div>
          <Link
            to="/products"
            className="text-sm mb-8 text-slate-200 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-slate-200 animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Controls */}
            <div className="hidden sm:flex absolute -top-12 right-0 gap-2">
              <button
                onClick={() =>
                  featuredRef.current?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
                className="w-9 h-9 rounded-full bg-slate-900/60 border border-slate-700 hover:bg-slate-900/80 flex items-center justify-center"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() =>
                  featuredRef.current?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  })
                }
                className="w-9 h-9 rounded-full bg-slate-900/60 border border-slate-700 hover:bg-slate-900/80 flex items-center justify-center"
              >
                <FiChevronRight />
              </button>
            </div>
            <div
              ref={featuredRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {featured.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="snap-start w-72 shrink-0 group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-slate-500/80 hover:bg-slate-900/70 transition"
                >
                  <div className="relative p-3">
                    <img
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded-xl"
                    />
                    <span className="absolute top-4 left-4 bg-slate-100 text-slate-950 text-[0.6rem] uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {product.category || "General"}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-50 line-clamp-2 min-h-10">
                      {product.name}
                    </h3>
                    {/* Rating row */}
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar className="opacity-50" />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-slate-50">
                        ${product.price}
                      </span>
                      <span className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded-full text-slate-950">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">What customers say</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              name: "Amira K.",
              quote:
                "Lightning fast delivery and the quality is superb. Love the dark theme too!",
            },
            {
              name: "Jason T.",
              quote:
                "Great curation. Found everything I needed without the clutter.",
            },
            {
              name: "Selena M.",
              quote: "Secure checkout and easy returns. Five stars from me.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-slate-300 leading-relaxed">“{t.quote}”</p>
              <p className="mt-3 text-sm text-slate-400">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
          {["Nova", "Apex", "Nimbus", "Vertex", "Orion", "Pulse"].map((b) => (
            <div
              key={b}
              className="shrink-0 text-slate-400 text-sm tracking-wider border border-slate-800 rounded-full px-4 py-2 bg-slate-900/40"
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-14 mt-6 border-t border-slate-800/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">
              Join our community
            </p>
            <h2 className="text-2xl font-bold mt-1">
              Get exclusive offers &amp; early access.
            </h2>
            <p className="text-sm text-white/70 mt-2">
              We send 1–2 emails per month. No spam.
            </p>
          </div>
          <form
            className="flex gap-3 flex-wrap"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-[220px] rounded-full bg-slate-900/40 border border-slate-700 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button
              type="submit"
              className="rounded-full bg-white text-slate-900 px-6 py-2 font-semibold cursor-pointer hover:bg-slate-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default Home;
