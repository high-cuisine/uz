// In-memory store for the bank prototype
// Single account with balance, persists while server is running

interface Account {
  id: string;
  name: string;
  cardNumber: string;
  balance: number;
}

interface TopupToken {
  token: string;
  accountId: string;
  createdAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __bankStore: {
    account: Account;
    topupTokens: Map<string, TopupToken>;
  } | undefined;
}

function initStore() {
  if (!global.__bankStore) {
    global.__bankStore = {
      account: {
        id: "main",
        name: "Алексей Носиков",
        cardNumber: "4276 8001 1234 5678",
        balance: 125000,
      },
      topupTokens: new Map(),
    };
  }
  return global.__bankStore;
}

export function getAccount(): Account {
  return initStore().account;
}

export function addBalance(amount: number): Account {
  const store = initStore();
  store.account.balance += amount;
  return store.account;
}

export function createTopupToken(accountId: string): string {
  const store = initStore();
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  store.topupTokens.set(token, {
    token,
    accountId,
    createdAt: Date.now(),
  });
  // Clean up tokens older than 1 hour
  for (const [key, val] of store.topupTokens.entries()) {
    if (Date.now() - val.createdAt > 3600_000) {
      store.topupTokens.delete(key);
    }
  }
  return token;
}

export function getTopupToken(token: string): TopupToken | undefined {
  return initStore().topupTokens.get(token);
}
