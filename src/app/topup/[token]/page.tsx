"use client";

import { use, useState } from "react";

const PRESETS = [10000, 50000, 100000, 500000];

type Status = "idle" | "loading" | "success" | "error";

export default function TopupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [newBalance, setNewBalance] = useState<number | null>(null);

  const handleSubmit = async () => {
    const parsed = parseFloat(amount.replace(",", "."));
    if (!parsed || parsed <= 0) {
      setErrorMsg("To'g'ri summani kiriting");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, amount: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "O'tkazma xatosi");
        setStatus("error");
        return;
      }
      setNewBalance(data.newBalance);
      setStatus("success");
    } catch {
      setErrorMsg("Server bilan aloqa yo'q");
      setStatus("error");
    }
  };

  const formatMoney = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0f0a1e 0%, #1a0d35 60%, #120822 100%)",
    color: "#f0eaff",
    fontFamily: "Arial, Helvetica, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  };

  if (status === "success") {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: "center", maxWidth: 360, width: "100%" }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 24px",
              boxShadow: "0 12px 40px rgba(34,197,94,0.4)",
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>O'tkazma amalga oshdi!</div>
          <div style={{ fontSize: 16, color: "#a78bcc", marginBottom: 28 }}>
            Hisobga o'tkazildi{" "}
            <span style={{ color: "#a3e635", fontWeight: 700 }}>
              +{formatMoney(parseFloat(amount))} сум
            </span>
          </div>
          {newBalance !== null && (
            <div
              style={{
                background: "rgba(109,40,217,0.2)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 16,
                padding: "16px 20px",
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 13, color: "#a78bcc", marginBottom: 6 }}>
                Yangi hisob balansi
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#c4b5fd" }}>
                {formatMoney(newBalance)} сум
              </div>
            </div>
          )}
          <div style={{ fontSize: 13, color: "#6b5f80" }}>Ushbu sahifani yopishingiz mumkin</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 380, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              margin: "0 auto 16px",
              boxShadow: "0 10px 30px rgba(168,85,247,0.4)",
            }}
          >
            💸
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Hisobni to'ldirish</div>
          <div style={{ fontSize: 14, color: "#a78bcc" }}>
            Hisobga o'tkazish uchun summani kiriting
          </div>
          <div
            style={{
              marginTop: 12,
              display: "inline-block",
              background: "rgba(109,40,217,0.2)",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 10,
              padding: "4px 14px",
              fontSize: 11,
              color: "#c4b5fd",
              letterSpacing: 1,
            }}
          >
            UZBank · Asosiy hisob
          </div>
        </div>

        {/* Amount input */}
        <div
          style={{
            background: "rgba(109,40,217,0.15)",
            border: "2px solid rgba(168,85,247,0.35)",
            borderRadius: 20,
            padding: "20px 20px",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 13, color: "#a78bcc", marginBottom: 10 }}>O'tkazma summasi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              max={1000000}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 36,
                fontWeight: 800,
                color: "#f0eaff",
                width: "100%",
              }}
            />
            <span style={{ fontSize: 28, color: "#a78bcc", fontWeight: 700, flexShrink: 0 }}>
              сум
            </span>
          </div>
        </div>

        {/* Error */}
        {(status === "error" || errorMsg) && (
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 14,
              fontSize: 14,
              color: "#fca5a5",
            }}
          >
            ⚠ {errorMsg}
          </div>
        )}

        {/* Presets */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(String(preset))}
              style={{
                padding: "10px 4px",
                background:
                  amount === String(preset)
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "rgba(109,40,217,0.2)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 12,
                color: amount === String(preset) ? "#fff" : "#c4b5fd",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {preset.toLocaleString("ru-RU")} сум
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !amount}
          style={{
            width: "100%",
            padding: "18px",
            background:
              status === "loading" || !amount
                ? "rgba(109,40,217,0.3)"
                : "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: "none",
            borderRadius: 18,
            color: status === "loading" || !amount ? "#6b5f80" : "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: status === "loading" || !amount ? "not-allowed" : "pointer",
            boxShadow:
              status === "loading" || !amount
                ? "none"
                : "0 8px 30px rgba(168,85,247,0.45)",
            letterSpacing: 0.5,
            transition: "all 0.2s",
          }}
        >
          {status === "loading" ? "Yuklanmoqda..." : "O'tkazish"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#4a3f60" }}>
          To'lov himoyalangan · UZBank 2026
        </div>
      </div>
    </div>
  );
}
