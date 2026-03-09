// ===========================================================
//  Local Database — localStorage wrapper for GameTix
//  No external services needed. Deploy anywhere.
// ===========================================================

const KEYS = {
  USERS: 'gametix_users',
  TICKETS: 'gametix_tickets',
  VERIFIED: 'gametix_verified', // Set of scanned ticket IDs
};

// --------------- Default Admin Account ---------------
const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: 'admin@gametix.com',
  password: 'admin123',
  displayName: 'Admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// --------------- Helpers ---------------
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// --------------- Init (seed default admin) ---------------
export function initDB() {
  const users = read(KEYS.USERS);
  if (!users.find(u => u.id === DEFAULT_ADMIN.id)) {
    write(KEYS.USERS, [DEFAULT_ADMIN, ...users]);
  }
}

// =====================  AUTH  =====================

export function login(email, password) {
  const users = read(KEYS.USERS);
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

// =====================  USERS  =====================

export function getUsers() {
  return read(KEYS.USERS).map(({ password, ...u }) => u);
}

export function getSellers() {
  return getUsers().filter(u => u.role === 'seller');
}

export function createSeller({ email, password, displayName }) {
  const users = read(KEYS.USERS);
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered.');
  }
  const newUser = {
    id: uid(),
    email,
    password,
    displayName: displayName || email.split('@')[0],
    role: 'seller',
    createdAt: new Date().toISOString(),
  };
  write(KEYS.USERS, [...users, newUser]);
  const { password: _, ...safe } = newUser;
  return safe;
}

export function deleteSeller(sellerId) {
  const users = read(KEYS.USERS);
  write(KEYS.USERS, users.filter(u => u.id !== sellerId || u.role === 'admin'));
}

// =====================  TICKETS  =====================

export function getTickets() {
  return read(KEYS.TICKETS);
}

export function getTicketById(ticketId) {
  return read(KEYS.TICKETS).find(t => t.id === ticketId) || null;
}

export function getTicketsBySeller(sellerId) {
  return read(KEYS.TICKETS).filter(t => t.sellerId === sellerId);
}

export function createTicket({ buyerName, filiere, phone, games, sellerId, sellerName }) {
  const ticket = {
    id: uid(),
    buyerName,
    filiere,
    phone,
    games,
    sellerId,
    sellerName,
    verified: false,
    createdAt: new Date().toISOString(),
  };
  const tickets = read(KEYS.TICKETS);
  write(KEYS.TICKETS, [...tickets, ticket]);
  return ticket;
}

// =====================  VERIFICATION  =====================

export function verifyTicket(ticketId) {
  // First check the verified set (for cross-device scans via QR data)
  const verified = new Set(read(KEYS.VERIFIED));

  // Also check and update the ticket in localStorage if it exists
  const tickets = read(KEYS.TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);

  if (verified.has(ticketId) || (ticket && ticket.verified)) {
    return { status: 'already_used', ticket };
  }

  // Mark as verified
  verified.add(ticketId);
  write(KEYS.VERIFIED, [...verified]);

  if (ticket) {
    ticket.verified = true;
    write(KEYS.TICKETS, tickets);
  }

  return { status: 'valid', ticket };
}

export function isTicketVerified(ticketId) {
  const verified = new Set(read(KEYS.VERIFIED));
  return verified.has(ticketId);
}
