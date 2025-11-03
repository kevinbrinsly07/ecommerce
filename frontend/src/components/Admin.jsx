import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
const darkBg = "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950";
const cardBg =
  "bg-slate-800/80 backdrop-blur-md shadow-lg border border-slate-700";
const inputBg =
  "bg-slate-800/60 border border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 text-slate-100";
const labelText = "text-slate-300 font-medium";
const statText = "text-3xl font-bold text-cyan-400 drop-shadow";
const errorText =
  "text-red-400 bg-red-900/40 p-2 rounded mb-2 border border-red-700";

const Admin = () => {
  const { token, config } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", price: 0, description: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

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
    loadStats();
    loadPendingOrders();
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
      // Reload stats or give feedback
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        config
      );
      setStats(res.data);
      setForm({ name: "", price: 0, description: "" });
      setImage(null);
    } catch (err) {
      console.error("Create failed", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
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
      <div
        className={cardBg + " w-full max-w-4xl p-8 rounded-2xl mb-8 shadow-xl"}
      >
        <h1 className="text-4xl font-extrabold text-cyan-400 mb-6 tracking-tight drop-shadow">
          Admin Dashboard
        </h1>
        {loading ? (
          <div className="text-slate-300 animate-pulse">Loading stats...</div>
        ) : error ? (
          <div className={errorText}>{error}</div>
        ) : (
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
        )}
        <section className={cardBg + " p-8 rounded-xl mt-2 mb-8"}>
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">
            Pending Orders
          </h2>
          {ordersLoading ? (
            <div className="text-slate-300">Loading pending orders...</div>
          ) : pendingOrders.length === 0 ? (
            <div className="text-slate-400">No pending orders.</div>
          ) : (
            <ul className="space-y-4">
              {pendingOrders.map((order) => (
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
          )}
        </section>
        <section className={cardBg + " p-8 rounded-xl mt-2"}>
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">
            Create Product
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className={labelText + " block mb-1"}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={"w-full p-3 rounded-lg " + inputBg}
                placeholder="Product name"
              />
            </div>
            <div>
              <label className={labelText + " block mb-1"}>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className={"w-full p-3 rounded-lg " + inputBg}
              />
            </div>
            <div>
              <label className={labelText + " block mb-1"}>Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={"w-full p-3 rounded-lg " + inputBg}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className={labelText + " block mb-1"}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={
                  "w-full p-3 rounded-lg resize-none min-h-20 " + inputBg
                }
                placeholder="Product description"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 transition rounded-lg text-slate-900 font-bold shadow">
                Create
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Admin;
