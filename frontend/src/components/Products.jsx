import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import placeholder from "../assets/placeholder.png";
import item1 from "../assets/item1.jpg";
import item2 from "../assets/item2.jpg";
import item3 from "../assets/item3.jpg";
import Footer from "./Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity"); // 'popularity' | 'price-asc' | 'price-desc' | 'newest'
  const [view, setView] = useState("grid"); // 'grid' | 'list'

  // Top banner carousel
  const bannerSlides = [
    {
      id: "s1",
      img: item3,
      title: "Seasonal Sale",
      subtitle: "Up to 40% off select styles",
      cta: "Shop Now",
      href: "/products",
    },
    {
      id: "s2",
      img: item2,
      title: "New Arrivals",
      subtitle: "Fresh drops for modern living",
      cta: "Explore",
      href: "/products",
    },
    {
      id: "s3",
      img: item1,
      title: "Editor’s Picks",
      subtitle: "Curated favorites this week",
      cta: "View Picks",
      href: "/products",
    },
  ];
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerTimer = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setBannerIndex((i) => (i + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(bannerTimer.current);
  }, [bannerSlides.length]);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];
  const _minPrice = products.length
    ? Math.min(...products.map((p) => Number(p.price) || 0))
    : 0;
  const _maxPrice = products.length
    ? Math.max(...products.map((p) => Number(p.price) || 0))
    : 0;

  const getSorted = (arr) => {
    if (sortBy === "price-asc")
      return [...arr].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price-desc")
      return [...arr].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "newest")
      return [...arr].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    return arr; // popularity (server-side default)
  };

  const filteredProducts = getSorted(
    products.filter((p) => {
      const byCat =
        selectedCategory === "All" ? true : p.category === selectedCategory;
      return byCat;
    })
  );

  const getImageSrc = (img) => {
    // no image at all → use local
    if (!img) return placeholder;

    // ignore old seeded placeholder host
    if (img.includes("via.placeholder.com")) return placeholder;

    // backend/static or real remote URL
    if (img.startsWith("http") || img.startsWith("/")) return img;

    // anything else → fallback
    return placeholder;
  };

  // Per-card image index map for simple sliders
  const [imgIndexById, setImgIndexById] = useState({});
  const getImages = (product) => {
    const raw =
      Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image];
    return raw.map((src) => getImageSrc(src));
  };
  const nextImg = (id, imgs) => {
    setImgIndexById((prev) => {
      const next = ((prev[id] ?? 0) + 1) % imgs.length;
      return { ...prev, [id]: next };
    });
  };
  const prevImg = (id, imgs) => {
    setImgIndexById((prev) => {
      const len = imgs.length;
      const next = ((prev[id] ?? 0) - 1 + len) % len;
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top banner carousel */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur">
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-96">
            {bannerSlides.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  idx === bannerIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${s.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-slate-950/60" />
            {/* Text + CTAs */}
            <div className="relative z-10 h-full flex items-center justify-between px-6 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-300">
                  Trending
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">
                  {bannerSlides[bannerIndex].title}
                </h2>
                <p className="text-slate-300 mt-1">
                  {bannerSlides[bannerIndex].subtitle}
                </p>
                <Link
                  to={bannerSlides[bannerIndex].href}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-950 px-4 py-2 text-sm font-semibold mt-4 hover:bg-white transition"
                >
                  {bannerSlides[bannerIndex].cta} <span aria-hidden>→</span>
                </Link>
              </div>
              {/* Controls */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() =>
                    setBannerIndex(
                      (i) => (i - 1 + bannerSlides.length) % bannerSlides.length
                    )
                  }
                  className="rounded-full bg-slate-900/60 border border-slate-700 text-slate-100 w-9 h-9 hover:bg-slate-900/80"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setBannerIndex((i) => (i + 1) % bannerSlides.length)
                  }
                  className="rounded-full bg-slate-900/60 border border-slate-700 text-slate-100 w-9 h-9 hover:bg-slate-900/80"
                >
                  ›
                </button>
              </div>
            </div>
            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {bannerSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === bannerIndex
                      ? "w-6 bg-slate-100"
                      : "w-3 bg-slate-500/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <header className="sticky top-26 z-30 bg-slate-950 border-y border-slate-900/40 rounded-b-xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Explore products
              </h1>
              <p className="text-slate-400 mt-1">
                Browse our curated selection of items.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Category select */}
              <div className="min-w-40">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/40 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sort select */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl bg-slate-900/40 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="popularity">Sort: Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    view === "grid"
                      ? "bg-slate-100 text-slate-950"
                      : "bg-slate-900/40 border border-slate-800 text-slate-100"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    view === "list"
                      ? "bg-slate-100 text-slate-950"
                      : "bg-slate-900/40 border border-slate-800 text-slate-100"
                  }`}
                >
                  List
                </button>
              </div>
              {/* (Disabled) Search */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800 rounded-xl px-3 py-2 shadow-sm shadow-slate-950/30 sm:min-w-60 backdrop-blur">
                  <span className="text-slate-400 text-sm">🔍</span>
                  <input
                    disabled
                    className="bg-transparent flex-1 outline-none text-sm text-slate-100 placeholder:text-slate-500"
                    placeholder="Search products..."
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {loading && (
          <div
            className={`grid gap-6 ${
              view === "list"
                ? "grid-cols-1"
                : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="animate-pulse bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden"
              >
                <div className="h-48 bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/5 bg-slate-800 rounded" />
                  <div className="h-3 w-4/5 bg-slate-800 rounded" />
                  <div className="h-3 w-2/5 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={`grid gap-6 ${
            view === "list"
              ? "grid-cols-1"
              : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((product) => {
            const imgs = getImages(product);
            const idx = imgIndexById[product._id] ?? 0;
            const rating = product.rating ?? 4.5;
            const reviews = product.reviews ?? 120;
            return (
              <div
                key={product._id}
                className="group bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden hover:-translate-y-px hover:border-slate-600/80 hover:bg-slate-900/70 transition flex flex-col"
              >
                <div className="relative h-48 bg-slate-800">
                  {/* Slide */}
                  <img
                    src={imgs[idx]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Hover Quick View */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Link
                      to={`/products/${product._id}`}
                      className="pointer-events-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-950 bg-slate-100/95 hover:bg-white rounded-full px-4 py-2 shadow-sm"
                    >
                      Quick View →
                    </Link>
                  </div>
                  {/* Controls */}
                  {imgs.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImg(product._id, imgs)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-slate-100 border border-slate-700 hover:bg-slate-900/70"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => nextImg(product._id, imgs)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-slate-100 border border-slate-700 hover:bg-slate-900/70"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                        {imgs.map((_, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setImgIndexById((prev) => ({
                                ...prev,
                                [product._id]: i,
                              }))
                            }
                            className={`h-1.5 rounded-full transition-all ${
                              i === idx
                                ? "w-6 bg-slate-100"
                                : "w-3 bg-slate-500/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <span className="absolute top-3 left-3 bg-slate-100 text-slate-950 text-[0.6rem] uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
                    New
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {product.category || "General"}
                  </p>
                  <p className="text-sm font-semibold text-slate-50 leading-snug line-clamp-2 min-h-10">
                    {product.name}
                  </p>
                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-400">★★★★★</span>
                    <span className="text-slate-400">
                      {rating} · {reviews} reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <span className="text-base font-bold text-slate-50">
                      ${product.price}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-950 bg-slate-100 hover:bg-white rounded-full px-4 py-2 transition shadow-sm"
                      >
                        View
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && filteredProducts.length === 0 && (
            <p className="text-slate-400">
              No products found for the selected filters.
            </p>
          )}
        </div>

        {/* You might also like - horizontal rail */}
        <div className="mt-12 mb-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">
              You might also like
            </h3>
            <div className="text-xs text-slate-400">Personalized picks</div>
          </div>
          <div
            className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-4 min-w-max pr-2">
              {(filteredProducts.length ? filteredProducts : products)
                .slice(0, 12)
                .map((p) => (
                  <Link
                    key={`rec-${p._id}`}
                    to={`/products/${p._id}`}
                    className="w-44 shrink-0 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600/80 transition"
                  >
                    <div className="h-28 bg-slate-800">
                      <img
                        src={getImageSrc(p.image)}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {p.category || "General"}
                      </p>
                      <p className="text-sm font-semibold text-slate-100 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-sm text-slate-100 mt-1">${p.price}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Products;
