"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Account {
  name: string;
  cardNumber: string;
  balance: number;
}

export default function CardPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchAccount = useCallback(() => {
    fetch("/api/balance")
      .then((r) => r.json())
      .then(setAccount);
  }, []);

  useEffect(() => {
    fetchAccount();
    // Poll balance every 3 seconds to catch top-ups from other devices
    const interval = setInterval(fetchAccount, 3000);
    return () => clearInterval(interval);
  }, [fetchAccount]);

  const handleTopup = async () => {
    setLoadingQR(true);
    try {
      const res = await fetch("/api/topup-token", { method: "POST" });
      const data = await res.json();
      const token = data.token as string;
      const origin = window.location.origin;
      const url = `${origin}/topup/${token}`;
      setQrToken(token);
      setQrUrl(url);
      setShowQR(true);
    } finally {
      setLoadingQR(false);
    }
  };

  const handleCopy = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrImageUrl = qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=220x220&bgcolor=1a0d35&color=c4b5fd&margin=10`
    : null;

  const formatBalance = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f0a1e 0%, #1a0d35 50%, #120822 100%)",
        color: "#f0eaff",
        fontFamily: "Arial, Helvetica, sans-serif",
        maxWidth: 430,
        margin: "0 auto",
        padding: "0 20px 40px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "52px 0 24px",
        }}
      >
        <Link
          href="/"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(109,40,217,0.25)",
            border: "1px solid rgba(168,85,247,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#f0eaff",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ←
        </Link>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Mening kartam</div>
      </div>

      {/* Card visual */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #9333ea 70%, #a855f7 100%)",
          borderRadius: 24,
          padding: "32px 28px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(109,40,217,0.55)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -70,
            left: -30,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 36,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>
              UZ<span style={{ color: "#e9d5ff" }}>Bank</span>
            </div>
            <div
              style={{
                width: 40,
                height: 28,
                borderRadius: 6,
                background: "rgba(255,215,0,0.7)",
              }}
            />
          </div>

          <div
            style={{
              width: 44,
              height: 34,
              borderRadius: 6,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              marginBottom: 20,
            }}
          />

          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", letterSpacing: 3, marginBottom: 20, filter: "blur(6px)", userSelect: "none" }}>
            {account?.cardNumber ?? "•••• •••• •••• ••••"}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                Egasi
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", filter: "blur(5px)", userSelect: "none" }}>
                {account?.name?.toUpperCase() ?? "..."}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                Muddat
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", filter: "blur(5px)", userSelect: "none" }}>09/28</div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance block */}
      <div
        style={{
          background: "rgba(109,40,217,0.15)",
          border: "1px solid rgba(168,85,247,0.25)",
          borderRadius: 20,
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: "#a78bcc", marginBottom: 6 }}>Mavjud balans</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#f0eaff", marginBottom: 4 }}>
          {account ? `${formatBalance(account.balance)} сум` : "..."}
        </div>
        <div style={{ fontSize: 12, color: "#a78bcc" }}>Real vaqtda yangilanadi</div>
      </div>

      {/* Card info rows */}
      <div
        style={{
          background: "rgba(109,40,217,0.1)",
          border: "1px solid rgba(168,85,247,0.15)",
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        {[
          { label: "Karta turi", value: "VISA Platinum" },
          { label: "Holati", value: "✓ Faol" },
          { label: "Cashback", value: "5% gacha" },
          { label: "Limit", value: "5 000 000 сум" },
        ].map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom:
                i < 3 ? "1px solid rgba(168,85,247,0.12)" : "none",
            }}
          >
            <span style={{ fontSize: 14, color: "#a78bcc" }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e9d5ff" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Topup button */}
      {!showQR ? (
        <button
          onClick={handleTopup}
          disabled={loadingQR}
          style={{
            width: "100%",
            padding: "18px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: "none",
            borderRadius: 18,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: loadingQR ? "not-allowed" : "pointer",
            boxShadow: "0 8px 30px rgba(168,85,247,0.45)",
            letterSpacing: 0.5,
            opacity: loadingQR ? 0.7 : 1,
          }}
        >
          {loadingQR ? "QR yaratilmoqda..." : "💳 Hisobni to'ldirish"}
        </button>
      ) : (
        /* QR panel */
        <div
          style={{
            background: "rgba(109,40,217,0.15)",
            border: "1px solid rgba(168,85,247,0.35)",
            borderRadius: 24,
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "#c4b5fd", marginBottom: 6 }}>
            To'ldirish uchun QR-kod
          </div>
          <div style={{ fontSize: 12, color: "#a78bcc", marginBottom: 20 }}>
            Boshqa telefondan skaner qiling, summani kiriting — pul ushbu hisobga tushadi
          </div>

          {qrImageUrl && (
            <div
              style={{
                display: "inline-block",
                background: "#1a0d35",
                borderRadius: 16,
                padding: 12,
                border: "2px solid rgba(168,85,247,0.4)",
                marginBottom: 20,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="To'ldirish uchun QR"
                width={200}
                height={200}
                style={{ display: "block", borderRadius: 8 }}
              />
            </div>
          )}

          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#a78bcc",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left",
              }}
            >
              {qrUrl}
            </div>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0,
                background: "rgba(168,85,247,0.3)",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
                color: "#f0eaff",
                fontWeight: 600,
              }}
            >
              {copied ? "✓" : "Nusxalash"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setShowQR(false);
                setQrToken(null);
                setQrUrl(null);
              }}
              style={{
                flex: 1,
                padding: "14px",
                background: "rgba(109,40,217,0.25)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 14,
                color: "#c4b5fd",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Yopish
            </button>
            <button
              onClick={handleTopup}
              style={{
                flex: 1,
                padding: "14px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                borderRadius: 14,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              QR yangilash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
