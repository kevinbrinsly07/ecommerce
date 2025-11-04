import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
const darkBg = "bg-slate-950";
const cardBg =
  "bg-slate-900 backdrop-blur-md shadow-lg border border-slate-700";
const inputBg =
  "bg-slate-800/60 border border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 text-slate-100";
const labelText = "text-slate-300 font-medium";
const statText = "text-3xl font-bold text-cyan-400 drop-shadow";
const errorText =
  "text-red-400 bg-red-900/40 p-2 rounded mb-2 border border-red-700";

const Admin = () => {
  // Pagination state for products
  const [productsPage, setProductsPage] = useState(1);
  const productsPageSize = 5;
  const { token, config } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    weight: "",
    dimensions: "",
    warranty: "",
    origin: "",
    shipping: "Free",
    returns: "30 days",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreateModal]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  // Pagination state
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPageSize = 5;
  // User management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadStats = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          ...config,
          signal: controller.signal,
        });
        setStats(res.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          // Request was cancelled, do nothing
        } else {
          console.error(
            "Failed to load admin stats",
            err.response?.data || err.message
          );
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    const loadProducts = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/products", config);
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
        console.error("Failed to load products", err);
      }
    };
    const loadPendingOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/orders/pending",
          config
        );
        setPendingOrders(res.data);
      } catch {
        setPendingOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    // Load users for user management
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", config);
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
        setUsersError(err.response?.data?.message || err.message);
      } finally {
        setUsersLoading(false);
      }
    };
    loadStats();
    loadProducts();
    loadPendingOrders();
    loadUsers();
    return () => {
      controller.abort();
    };
  }, [token, config]);
  const handleApproveOrder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/orders/${orderId}/approve`,
        {},
        config
      );
      setPendingOrders((orders) => orders.filter((o) => o._id !== orderId));
      // Optionally reload stats
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        config
      );
      setStats(res.data);
    } catch (err) {
      console.error(
        "Failed to approve order",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || err.message);
      alert("Failed to approve order");
    }
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("sku", form.sku);
      formData.append("stock", form.stock);
      formData.append("weight", form.weight);
      formData.append("dimensions", form.dimensions);
      formData.append("warranty", form.warranty);
      formData.append("origin", form.origin);
      formData.append("shipping", form.shipping);
      formData.append("returns", form.returns);
      if (image) {
        formData.append("image", image);
      }
      await axios.post("http://localhost:5000/api/admin/products", formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      // Reload stats and products
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        config
      );
      setStats(res.data);
      const prodRes = await axios.get("http://localhost:5000/api/products", config);
      setProducts(prodRes.data);
      setForm({
        name: "",
        price: 0,
        description: "",
        category: "",
        brand: "",
        sku: "",
        stock: "",
        weight: "",
        dimensions: "",
        warranty: "",
        origin: "",
        shipping: "Free",
        returns: "30 days",
      });
      setImage(null);
    } catch (err) {
      console.error("Create failed", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
      console.error("Failed to delete user", err);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, config);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to change user role");
      console.error("Failed to change user role", err);
    }
  };

  const handleRemoveProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, config);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      // Optionally reload stats
      const res = await axios.get("http://localhost:5000/api/admin/stats", config);
      setStats(res.data);
    } catch (err) {
      alert("Failed to remove product");
      console.error("Failed to remove product", err);
    }
  };

  if (!token) {
    return (
      <div
        className={
          "p-8 min-h-[60vh] flex items-center justify-center " + darkBg
        }
      >
        <div className={cardBg + " p-8 rounded-xl w-full max-w-md text-center"}>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">
            Admin Access Required
          </h2>
          <p className="text-slate-300">
            Please log in as an admin to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "min-h-screen " +
        darkBg +
        " py-10 px-4 flex flex-col items-center justify-start"
      }
    >
      <div className="w-full max-w-[1000px] p-8 rounded-2xl mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight drop-shadow">
            Admin Dashboard
          </h1>
          <button
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 transition rounded-lg text-slate-900 font-bold shadow"
            onClick={() => setShowCreateModal(true)}
          >
            Add Product
          </button>
        </div>
        {loading ? (
          <div className="text-slate-300 animate-pulse">Loading stats...</div>
        ) : error ? (
          <div className={errorText}>{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                className={cardBg + " p-6 rounded-xl flex flex-col items-center"}
              >
                <span className="text-slate-400 mb-2">Products</span>
                <span className={statText}>{stats?.products}</span>
              </div>
              <div
                className={cardBg + " p-6 rounded-xl flex flex-col items-center"}
              >
                <span className="text-slate-400 mb-2">Pending Orders</span>
                <span className={statText}>{stats?.ordersPending}</span>
              </div>
              <div
                className={cardBg + " p-6 rounded-xl flex flex-col items-center"}
              >
                <span className="text-slate-400 mb-2">Orders Today</span>
                <span className={statText}>{stats?.ordersToday}</span>
              </div>
            </div>
            {/* Product List and Pending Orders side by side */}
            <div className="flex flex-col md:flex-row gap-8">
              <section className={cardBg + " p-8 rounded-xl mb-8 flex-1"}>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Products</h2>
                {/* ...existing code for products list... */}
                {products.length === 0 ? (
                  <div className="text-slate-400">No products found.</div>
                ) : (
                  <>
                    <ul className="space-y-4">
                      {products
                        .slice(
                          (productsPage - 1) * productsPageSize,
                          productsPage * productsPageSize
                        )
                        .map((product) => (
                          <li key={product._id} className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="font-bold text-cyan-300">{product.name}</div>
                              <div className="text-slate-300 text-sm">${product.price}</div>
                              <div className="text-slate-300 text-sm">{product.category}</div>
                              <div className="text-slate-300 text-sm">{product.brand}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product._id)}
                              className="mt-3 md:mt-0 px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-900 font-bold rounded shadow"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                    {/* Pagination Controls - match Products list style */}
                    {products.length > productsPageSize && (
                      <div className="flex justify-center items-center mt-6 gap-2">
                        <button
                          className="px-3 py-1 rounded bg-slate-800 text-cyan-300 disabled:opacity-50"
                          disabled={productsPage === 1}
                          onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                        >
                          Prev
                        </button>
                        {Array.from({ length: Math.ceil(products.length / productsPageSize) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setProductsPage(i + 1)}
                            className={`px-3 py-1 rounded transition-all font-medium ${
                              productsPage === i + 1
                                ? "bg-cyan-500 text-white font-bold"
                                : "bg-slate-800 text-cyan-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          className="px-3 py-1 rounded bg-slate-800 text-cyan-300 disabled:opacity-50"
                          disabled={productsPage === Math.ceil(products.length / productsPageSize)}
                          onClick={() => setProductsPage((p) => Math.min(Math.ceil(products.length / productsPageSize), p + 1))}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
              <section className={cardBg + " p-8 rounded-xl mb-8 flex-1"}>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                  Pending Orders
                </h2>
                {/* ...existing code for pending orders... */}
                {ordersLoading ? (
                  <div className="text-slate-300">Loading pending orders...</div>
                ) : pendingOrders.length === 0 ? (
                  <div className="text-slate-400">No pending orders.</div>
                ) : (
                  <>
                    <ul className="space-y-4">
                      {pendingOrders
                        .slice(
                          (ordersPage - 1) * ordersPageSize,
                          ordersPage * ordersPageSize
                        )
                        .map((order) => (
                          <li
                            key={order._id}
                            className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <div className="font-bold text-cyan-300">
                                Order #{order._id}
                              </div>
                              <div className="text-slate-300 text-sm">
                                User: {order.user?.username || order.user}
                              </div>
                              <div className="text-slate-300 text-sm">
                                Total: ${order.total}
                              </div>
                              <div className="text-slate-300 text-sm">
                                Items: {order.items.length}
                              </div>
                            </div>
                            <button
                              onClick={() => handleApproveOrder(order._id)}
                              className="mt-3 md:mt-0 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded shadow"
                            >
                              Approve
                            </button>
                          </li>
                        ))}
                    </ul>
                    {/* Pagination Controls - match Products list style */}
                    {pendingOrders.length > ordersPageSize && (
                      <div className="flex justify-center items-center mt-6 gap-2">
                        <button
                          className="px-3 py-1 rounded bg-slate-800 text-cyan-300 disabled:opacity-50"
                          disabled={ordersPage === 1}
                          onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        >
                          Prev
                        </button>
                        {Array.from({ length: Math.ceil(pendingOrders.length / ordersPageSize) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setOrdersPage(i + 1)}
                            className={`px-3 py-1 rounded transition-all font-medium ${
                              ordersPage === i + 1
                                ? "bg-cyan-500 text-white font-bold"
                                : "bg-slate-800 text-cyan-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          className="px-3 py-1 rounded bg-slate-800 text-cyan-300 disabled:opacity-50"
                          disabled={ordersPage === Math.ceil(pendingOrders.length / ordersPageSize)}
                          onClick={() => setOrdersPage((p) => Math.min(Math.ceil(pendingOrders.length / ordersPageSize), p + 1))}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
            {/* User Management Section below */}
            <section className={cardBg + " p-8 rounded-xl mb-8 w-full"}>
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">Manage Users</h2>
              {usersLoading ? (
                <div className="text-slate-300">Loading users...</div>
              ) : usersError ? (
                <div className={errorText}>{usersError}</div>
              ) : users.length === 0 ? (
                <div className="text-slate-400">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-cyan-300">
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-slate-700">
                          <td className="px-4 py-2 text-slate-200">{user.username}</td>
                          <td className="px-4 py-2 text-slate-200">
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeRole(user._id, e.target.value)}
                              className="bg-slate-900 text-cyan-300 rounded px-2 py-1 border border-slate-700"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-400 text-slate-900 font-bold rounded shadow"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* Removed orphaned section closing tag after modal */}
        {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
              {/* Modal */}
              <div className="relative z-10 bg-slate-950 border border-slate-800 shadow-2xl rounded-2xl p-8 w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
                <button
                  className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 text-2xl font-bold"
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
                <h3 className="text-2xl font-bold text-cyan-300 mb-6 text-center">Add Product</h3>
                <form onSubmit={(e) => { handleCreate(e); setShowCreateModal(false); }} className="space-y-5 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelText + " block mb-1"}>Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Product name" required />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Category</label>
                      <input name="category" value={form.category} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Category" required />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Brand</label>
                      <input name="brand" value={form.brand} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Brand" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>SKU</label>
                      <input name="sku" value={form.sku} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="SKU" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Stock</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Stock quantity" min="0" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Weight</label>
                      <input name="weight" value={form.weight} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Weight" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Dimensions</label>
                      <input name="dimensions" value={form.dimensions} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Dimensions" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Warranty</label>
                      <input name="warranty" value={form.warranty} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Warranty" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Origin</label>
                      <input name="origin" value={form.origin} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Origin" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Shipping</label>
                      <input name="shipping" value={form.shipping} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Shipping" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Returns</label>
                      <input name="returns" value={form.returns} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="Returns" />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className={"w-full p-3 rounded-lg " + inputBg} />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Price</label>
                      <input name="price" type="number" value={form.price} onChange={handleChange} className={"w-full p-3 rounded-lg " + inputBg} placeholder="0.00" min="0" step="0.01" required />
                    </div>
                    <div>
                      <label className={labelText + " block mb-1"}>Description</label>
                      <textarea name="description" value={form.description} onChange={handleChange} className={"w-full p-3 rounded-lg resize-none min-h-20 " + inputBg} placeholder="Product description" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 transition rounded-lg text-slate-900 font-bold shadow">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Admin;
