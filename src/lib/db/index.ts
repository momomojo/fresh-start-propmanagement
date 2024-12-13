// Temporary in-memory store for development
const db = {
  users: new Map(),
  properties: new Map(),
  leases: new Map(),
  maintenance: new Map(),
  payments: new Map()
};

export default db;