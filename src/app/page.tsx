"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Account {
  name: string;
  cardNumber: string;
  balance: number;
}

const ACTION_BUTTONS = [
  { icon: "↑", label: "Перевод" },
  { icon: "↓", label: "Пополнить" },
  { icon: "⊞", label: "Платежи" },
  { icon: "◎", label: "QR-оплата" },
];

const QUICK_ACTIONS = [
  { icon: "📱", label: "Связь" },
  { icon: "🏠", label: "ЖКХ" },
  { icon: "🎮", label: "Игры" },
  { icon: "✈️", label: "Авиа" },
  { icon: "🛍️", label: "Маркет" },
];


export default function Home() {
  const [account, setAccount] = useState<Account | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetch("/api/balance")
      .then((r) => r.json())
      .then(setAccount);
  }, []);

  const formatBalance = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const s = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f0a1e 0%, #1a0d35 50%, #120822 100%)",
      color: "#f0eaff",
      fontFamily: "Arial, Helvetica, sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      paddingBottom: 80,
    } as React.CSSProperties,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "52px 20px 16px",
    } as React.CSSProperties,
    avatar: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      boxShadow: "0 4px 15px rgba(168,85,247,0.4)",
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontSize: 13, color: "#a78bcc", marginBottom: 2 }}>Добро пожаловать</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{account?.name ?? "..."}</div>
        </div>
        <div style={s.avatar}>👤</div>
      </div>

      {/* Balance Card */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <Link href="/card" style={{ textDecoration: "none", display: "block" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #9333ea 70%, #a855f7 100%)",
              borderRadius: 24,
              padding: "28px 24px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(109,40,217,0.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -20,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                Основной счёт
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1 }}
                >
                  {balanceVisible
                    ? account
                      ? `${formatBalance(account.balance)} ₽`
                      : "..."
                    : "•••• ••"}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBalanceVisible((v) => !v);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#fff",
                  }}
                >
                  {balanceVisible ? "👁" : "🙈"}
                </button>
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", letterSpacing: 2 }}>
                {account?.cardNumber ?? "•••• •••• •••• ••••"}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Нажми для деталей →
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  VISA
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: "0 20px", marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {ACTION_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              style={{
                background: "rgba(109,40,217,0.35)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 16,
                padding: "16px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                color: "#f0eaff",
                boxShadow: "0 4px 12px rgba(109,40,217,0.2)",
                transition: "background 0.15s, transform 0.15s",
              }}
            >
              <span style={{ fontSize: 22 }}>{btn.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "0 20px", marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#c4b5fd", marginBottom: 14 }}>
          Быстрые платежи
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              style={{
                flex: "0 0 auto",
                background: "rgba(109,40,217,0.2)",
                border: "1px solid rgba(168,85,247,0.25)",
                borderRadius: 16,
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                minWidth: 72,
                color: "#f0eaff",
              }}
            >
              <span style={{ fontSize: 26 }}>{a.icon}</span>
              <span style={{ fontSize: 11, color: "#c4b5fd", whiteSpace: "nowrap" }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>


      {/* Bottom Nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: "rgba(15, 10, 30, 0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(168,85,247,0.2)",
          padding: "12px 20px 24px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {[
          { icon: "⊞", label: "Главная", active: true },
          { icon: "💳", label: "Карты" },
          { icon: "📊", label: "Аналитика" },
          { icon: "💬", label: "Чат" },
          { icon: "☰", label: "Ещё" },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              color: item.active ? "#a855f7" : "#6b5f80",
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 400 }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
