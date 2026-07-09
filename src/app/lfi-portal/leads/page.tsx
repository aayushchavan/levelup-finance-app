"use client";

import { useEffect, useState, useMemo } from "react";
import { Lead } from "@/lib/types/settings";
import { Users, Search, Download, RefreshCw, TrendingUp, UserCheck, Phone } from "lucide-react";

const STATUS_OPTIONS = ["New", "Contacted", "Enrolled", "Rejected"] as const;

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Contacted: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Enrolled: "bg-green-500/15 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingRow, setUpdatingRow] = useState<number | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok) setLeads(data.leads);
      else setError(data.error || "Failed to fetch leads");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search);
      const matchStatus = statusFilter === "All" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    enrolled: leads.filter((l) => l.status === "Enrolled").length,
  }), [leads]);

  const updateStatus = async (rowIndex: number, status: string) => {
    setUpdatingRow(rowIndex);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex, status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => l.rowIndex === rowIndex ? { ...l, status: status as Lead["status"] } : l)
        );
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingRow(null);
    }
  };

  const exportCSV = () => {
    const headers = ["#", "Timestamp", "Name", "Email", "Phone", "Message", "Status"];
    const rows = leads.map((l, i) =>
      [i + 1, l.timestamp, l.name, l.email, l.phone, `"${l.message}"`, l.status].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-slate-400 text-sm mt-1">All student enquiries and registrations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-600/50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Leads", value: stats.total, icon: Users, color: "text-slate-300" },
          { label: "New", value: stats.new, icon: TrendingUp, color: "text-blue-400" },
          { label: "Contacted", value: stats.contacted, icon: Phone, color: "text-yellow-400" },
          { label: "Enrolled", value: stats.enrolled, icon: UserCheck, color: "text-green-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex gap-2">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition border ${
                statusFilter === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading leads...</div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 text-center">
          {error}
          <br />
          <span className="text-sm text-slate-500 mt-1 block">Make sure your .env.local is configured with GOOGLE_SERVICE_KEY and SHEET_ID</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p>No leads found</p>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.rowIndex} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                    <td className="px-5 py-4 text-slate-500">{i + 1}</td>
                    <td className="px-5 py-4 text-white font-medium">{lead.name}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.email}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.phone}</td>
                    <td className="px-5 py-4 text-slate-400 max-w-xs truncate">{lead.message || "—"}</td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{lead.timestamp}</td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        disabled={updatingRow === lead.rowIndex}
                        onChange={(e) => updateStatus(lead.rowIndex, e.target.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent cursor-pointer focus:outline-none transition ${STATUS_STYLES[lead.status] || STATUS_STYLES.New}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-slate-800 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
