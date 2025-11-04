import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaStar,
  FaFilter,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import placeholder from "../assets/placeholder.png";
// ...existing code...
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
  const [searchTerm, setSearchTerm] = useState("");
  // Sidebar navigation toggle (for mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Group products by category
  // Filter and search products
  const getFilteredProducts = (arr) => {
    let filtered = arr;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }
    return getSorted(filtered);
  };

  // For category sections
  const productsByCategory = categories
    .filter((c) => c !== "All")
    .map((cat) => ({
      category: cat,
      products: getFilteredProducts(products.filter((p) => p.category === cat)),
    }));

  // For dropdown filtered view
  const filteredProducts = getFilteredProducts(products);

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (img.includes("via.placeholder.com")) return placeholder;
    if (img.includes("picsum.photos")) return placeholder;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/images/")) return `http://localhost:5000${img}`;
    if (img.startsWith("/")) return img;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-10 flex flex-col">
      <div
        className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1"
        style={{ height: "100%" }}
      >
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Categories</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <nav aria-label="Product categories">
                <ul className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition font-medium text-base ${
                          selectedCategory === cat
                            ? "bg-cyan-600 text-white shadow"
                            : "bg-slate-900/40 text-slate-200 hover:bg-slate-800"
                        }`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSidebarOpen(false);
                        }}
                        aria-current={
                          selectedCategory === cat ? "page" : undefined
                        }
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        )}
        {/* Sidebar navigation for categories */}
        <aside className="hidden lg:block w-full max-w-xs shrink-0 sticky top-10 h-[calc(100vh-2.5rem)] overflow-y-auto">
          <nav aria-label="Product categories">
            <ul className="flex flex-col gap-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition font-medium text-base ${
                      selectedCategory === cat
                        ? "bg-cyan-600 text-white shadow"
                        : "bg-slate-900/40 text-slate-200 hover:bg-slate-800"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                    aria-current={selectedCategory === cat ? "page" : undefined}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            {/* Filters section */}
            <div className="mt-8">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow p-5 flex flex-col gap-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                    <span>
                      <FaFilter className="inline text-cyan-300" />
                    </span>{" "}
                    Filters
                  </h3>
                  <button className="text-xs px-3 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition">
                    Reset
                  </button>
                </div>
                {/* Price Range */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-semibold">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={_minPrice}
                      max={_maxPrice}
                      value={_minPrice}
                      readOnly
                      className="w-16 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-100 text-xs"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      min={_minPrice}
                      max={_maxPrice}
                      value={_maxPrice}
                      readOnly
                      className="w-16 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-100 text-xs"
                    />
                  </div>
                </div>
                {/* Rating */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-semibold">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-lg">
                      <FaStar />
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      value={4}
                      readOnly
                      className="w-12 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-100 text-xs"
                    />
                  </div>
                </div>
                {/* Availability & Shipping */}
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1 font-semibold">
                      Availability
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="inStock"
                        className="accent-cyan-600"
                      />
                      <label
                        htmlFor="inStock"
                        className="text-slate-200 text-xs"
                      >
                        In Stock Only
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1 font-semibold">
                      Shipping
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="freeShipping"
                        className="accent-cyan-600"
                      />
                      <label
                        htmlFor="freeShipping"
                        className="text-slate-200 text-xs"
                      >
                        Free Shipping
                      </label>
                    </div>
                  </div>
                </div>
                {/* Color */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-semibold">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="w-6 h-6 rounded-full bg-red-500 border-2 border-slate-800"
                      title="Red"
                    ></button>
                    <button
                      className="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-800"
                      title="Blue"
                    ></button>
                    <button
                      className="w-6 h-6 rounded-full bg-green-500 border-2 border-slate-800"
                      title="Green"
                    ></button>
                    <button
                      className="w-6 h-6 rounded-full bg-black border-2 border-slate-800"
                      title="Black"
                    ></button>
                    <button
                      className="w-6 h-6 rounded-full bg-white border-2 border-slate-800"
                      title="White"
                    ></button>
                  </div>
                </div>
                {/* Size */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-semibold">
                    Size
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs">
                      XS
                    </button>
                    <button className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs">
                      S
                    </button>
                    <button className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs">
                      M
                    </button>
                    <button className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs">
                      L
                    </button>
                    <button className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs">
                      XL
                    </button>
                  </div>
                </div>
                {/* Material */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-semibold">
                    Material
                  </label>
                  <select className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-100 text-xs">
                    <option value="">Any</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Leather">Leather</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Wool">Wool</option>
                  </select>
                </div>
              </div>
            </div>
          </nav>
        </aside>
        <div className="w-full flex-1 min-w-0 h-full overflow-y-auto">
          {/* Search bar at top, full width */}
          <div className="w-full mb-6">
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800 rounded-xl px-3 py-5 shadow-sm shadow-slate-950/30 w-full backdrop-blur">
              <span className="text-slate-400 text-lg">
                <FaSearch />
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent flex-1 outline-none text-base text-slate-100 placeholder:text-slate-500"
                placeholder="Search products..."
              />
            </div>
          </div>
          {/* Carousel positioned above Explore Products */}
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur">
            <div className="relative h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96">
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
              <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-4">
                <div className="flex-1">
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
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setBannerIndex(
                        (i) =>
                          (i - 1 + bannerSlides.length) % bannerSlides.length
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
          <header className="top-26 z-30 bg-slate-950 border-y border-slate-900/40 rounded-b-xl mb-8">
            <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4 px-2 sm:px-4 py-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Explore products
                </h1>
                <p className="text-slate-400 mt-1">
                  Browse our curated selection of items.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Sidebar toggle for mobile */}
                <button
                  className="lg:hidden px-3 py-2 rounded-lg bg-cyan-600 text-white font-semibold"
                  onClick={() => setSidebarOpen((v) => !v)}
                  aria-label="Show categories"
                >
                  Categories
                </button>
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
                {/* Search removed from here */}
              </div>
            </div>
          </header>

          {/* Products divided by category */}
          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-12 text-center">
              <span className="mb-6 text-cyan-500 opacity-80">
                <FaSearch size={80} />
              </span>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                No products found
              </h2>
              <p className="text-slate-400 mb-4">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button
                className="px-5 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <>
              {productsByCategory.map(
                ({ category, products }) =>
                  products.length > 0 && (
                    <section key={category} className="mb-14">
                      <div className="flex items-center justify-between mb-3 mt-14">
                        <button
                          className={`text-lg font-semibold tracking-wide px-4 py-1 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
                            selectedCategory === category
                              ? "bg-cyan-600 text-white shadow"
                              : "bg-slate-900/40 text-slate-300 hover:bg-slate-800"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                          aria-label={`Filter by ${category}`}
                        >
                          {category}
                        </button>
                        <div className="text-xs text-slate-400">
                          Category picks
                        </div>
                      </div>
                      <div
                        className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] pb-2"
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        <div
                          className="flex gap-4 min-w-0 sm:min-w-max pr-2"
                          id="products-desktop-rail"
                        >
                          {products.map((product) => {
                            const imgs = getImages(product);
                            const idx = imgIndexById[product._id] ?? 0;
                            const rating = product.rating ?? 4.5;
                            const reviews = product.reviews ?? 120;
                            return (
                              <div
                                key={product._id}
                                className="w-56 sm:w-64 shrink-0 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600/80 transition flex flex-col"
                              >
                                <div className="relative h-36 sm:h-44 bg-slate-800">
                                  <img
                                    src={imgs[idx]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <Link
                                      to={`/products/${product._id}`}
                                      className="pointer-events-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-950 bg-slate-100/95 hover:bg-white rounded-full px-4 py-2 shadow-sm"
                                    >
                                      Quick View →
                                    </Link>
                                  </div>
                                  {imgs.length > 1 && (
                                    <>
                                      <button
                                        onClick={() =>
                                          prevImg(product._id, imgs)
                                        }
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 text-slate-100 border border-slate-700 hover:bg-slate-900/70"
                                      >
                                        <FaArrowLeft />
                                      </button>
                                      <button
                                        onClick={() =>
                                          nextImg(product._id, imgs)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 text-slate-100 border border-slate-700 hover:bg-slate-900/70"
                                      >
                                        <FaArrowRight />
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
                                </div>
                                <div className="p-4 flex flex-col gap-2 flex-1">
                                  <p className="text-xs uppercase tracking-wide text-slate-400">
                                    {product.category || "General"}
                                  </p>
                                  <p className="text-sm font-medium text-slate-50 leading-snug line-clamp-2 min-h-10">
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-amber-400 flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                      ))}
                                    </span>
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
                        </div>
                      </div>
                    </section>
                  )
              )}
            </>
          )}

          {/* You might also like - horizontal rail */}
          <div className="mt-8 mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
              <h3 className="text-lg font-semibold text-white">
                You might also like
              </h3>
              <div className="text-xs text-slate-400">Personalized picks</div>
            </div>
            <div
              className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div
                className="flex gap-3 sm:gap-4 min-w-0 sm:min-w-max pr-2"
                id="products-desktop-rail-recs"
              >
                {(filteredProducts.length ? filteredProducts : products)
                  .slice(0, 12)
                  .map((p) => (
                    <Link
                      key={`rec-${p._id}`}
                      to={`/products/${p._id}`}
                      className="w-36 sm:w-44 shrink-0 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600/80 transition"
                    >
                      <div className="h-24 sm:h-28 bg-slate-800">
                        <img
                          src={getImageSrc(p.image)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {p.category || "General"}
                        </p>
                        <p className="text-sm font-semibold text-slate-100 line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-sm text-slate-100 mt-1">
                          ${p.price}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Products;
