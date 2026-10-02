export function buildAdminCustomers({ users = [], orders = [], customPrintRequests = [] }) {
  return users.filter(user => user.role === 'customer').map(user => ({
    id: String(user.id),
    name: user.name || '',
    email: user.email || '',
    status: user.status || '—',
    createdAt: user.createdAt || '',
    orders: orders.filter(order => String(order.userId) === String(user.id)),
    requests: customPrintRequests.filter(request => String(request.userId) === String(user.id)),
  })).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export function filterAdminCustomers(customers, query = '') {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return customers;
  return customers.filter(customer => `${customer.id} ${customer.name} ${customer.email} ${customer.status}`
    .toLocaleLowerCase().includes(normalized));
}
