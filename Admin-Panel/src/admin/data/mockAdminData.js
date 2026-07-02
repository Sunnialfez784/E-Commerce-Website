function svgDataUri({ title, subtitle, gradientStart, gradientEnd }) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" rx="40" fill="url(#g)" />
      <circle cx="520" cy="108" r="94" fill="rgba(255,255,255,0.16)" />
      <circle cx="118" cy="302" r="74" fill="rgba(255,255,255,0.12)" />
      <text x="48" y="170" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${title}</text>
      <text x="48" y="228" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="rgba(255,255,255,0.88)">${subtitle}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const dashboardSeries = {
  sales: [42, 68, 52, 78, 60, 92, 84, 102, 88, 120, 118, 140],
  orders: [18, 24, 20, 28, 22, 34, 31, 36, 32, 41, 39, 48],
}

export const recentOrders = [
  { id: "ORD-1001", customer: "Ava Johnson", amount: 428, status: "Delivered", paymentStatus: "Paid", date: "2026-05-20", items: 3 },
  { id: "ORD-1002", customer: "Noah Smith", amount: 219, status: "Shipped", paymentStatus: "Paid", date: "2026-05-21", items: 2 },
  { id: "ORD-1003", customer: "Mia Brown", amount: 796, status: "Pending", paymentStatus: "Pending", date: "2026-05-22", items: 5 },
  { id: "ORD-1004", customer: "Liam Davis", amount: 154, status: "Cancelled", paymentStatus: "Refunded", date: "2026-05-18", items: 1 },
  { id: "ORD-1005", customer: "Sophia Wilson", amount: 963, status: "Delivered", paymentStatus: "Paid", date: "2026-05-17", items: 6 },
]

export const products = [
  { id: "PRD-1001", name: "Apex Wireless Headphones", category: "Electronics", price: 159, stock: 48, status: "Active", rating: 4.8, sales: 1260, image: svgDataUri({ title: "Apex", subtitle: "Wireless Headphones", gradientStart: "#0f172a", gradientEnd: "#2563eb" }) },
  { id: "PRD-1002", name: "Canvas Street Backpack", category: "Accessories", price: 89, stock: 24, status: "Active", rating: 4.7, sales: 860, image: svgDataUri({ title: "Canvas", subtitle: "Street Backpack", gradientStart: "#7c3aed", gradientEnd: "#ef4444" }) },
  { id: "PRD-1003", name: "Studio Smart Watch", category: "Electronics", price: 199, stock: 18, status: "Low Stock", rating: 4.6, sales: 940, image: svgDataUri({ title: "Studio", subtitle: "Smart Watch", gradientStart: "#0f766e", gradientEnd: "#14b8a6" }) },
  { id: "PRD-1004", name: "Minimal Desk Lamp", category: "Home", price: 49, stock: 72, status: "Active", rating: 4.4, sales: 520, image: svgDataUri({ title: "Minimal", subtitle: "Desk Lamp", gradientStart: "#92400e", gradientEnd: "#f59e0b" }) },
  { id: "PRD-1005", name: "Everyday Hoodie", category: "Apparel", price: 74, stock: 31, status: "Active", rating: 4.9, sales: 1450, image: svgDataUri({ title: "Everyday", subtitle: "Hoodie", gradientStart: "#111827", gradientEnd: "#64748b" }) },
  { id: "PRD-1006", name: "Velvet Lip Set", category: "Beauty", price: 39, stock: 14, status: "Low Stock", rating: 4.5, sales: 460, image: svgDataUri({ title: "Velvet", subtitle: "Lip Set", gradientStart: "#9f1239", gradientEnd: "#ec4899" }) },
  { id: "PRD-1007", name: "Cotton Overshirt", category: "Apparel", price: 64, stock: 55, status: "Active", rating: 4.3, sales: 780, image: svgDataUri({ title: "Cotton", subtitle: "Overshirt", gradientStart: "#1d4ed8", gradientEnd: "#38bdf8" }) },
  { id: "PRD-1008", name: "Ceramic Serveware Set", category: "Home", price: 112, stock: 22, status: "Active", rating: 4.7, sales: 620, image: svgDataUri({ title: "Ceramic", subtitle: "Serveware", gradientStart: "#4b5563", gradientEnd: "#d1d5db" }) },
  { id: "PRD-1009", name: "Travel Bottle Kit", category: "Accessories", price: 27, stock: 87, status: "Active", rating: 4.2, sales: 530, image: svgDataUri({ title: "Travel", subtitle: "Bottle Kit", gradientStart: "#0f172a", gradientEnd: "#059669" }) },
]

export const users = [
  { id: "USR-1001", name: "Ava Johnson", email: "ava@shoplane.com", role: "Customer", status: "Active", joinedAt: "2025-11-20", orders: 12, spend: 1840 },
  { id: "USR-1002", name: "Noah Smith", email: "noah@shoplane.com", role: "Customer", status: "Blocked", joinedAt: "2025-09-14", orders: 4, spend: 390 },
  { id: "USR-1003", name: "Mia Brown", email: "mia@shoplane.com", role: "VIP", status: "Active", joinedAt: "2025-08-02", orders: 22, spend: 4290 },
  { id: "USR-1004", name: "Ethan Miller", email: "ethan@shoplane.com", role: "Customer", status: "Active", joinedAt: "2025-12-01", orders: 8, spend: 940 },
  { id: "USR-1005", name: "Sophia Wilson", email: "sophia@shoplane.com", role: "VIP", status: "Active", joinedAt: "2025-07-18", orders: 18, spend: 3210 },
  { id: "USR-1006", name: "Liam Davis", email: "liam@shoplane.com", role: "Customer", status: "Blocked", joinedAt: "2026-01-10", orders: 2, spend: 110 },
]

export const orders = [
  { id: "INV-5001", orderId: "ORD-1001", customer: "Ava Johnson", email: "ava@shoplane.com", amount: 428, status: "Delivered", paymentStatus: "Paid", date: "2026-05-20", items: ["Apex Wireless Headphones", "Travel Bottle Kit"], shippingAddress: "New York, USA" },
  { id: "INV-5002", orderId: "ORD-1002", customer: "Noah Smith", email: "noah@shoplane.com", amount: 219, status: "Shipped", paymentStatus: "Paid", date: "2026-05-21", items: ["Minimal Desk Lamp"], shippingAddress: "Austin, USA" },
  { id: "INV-5003", orderId: "ORD-1003", customer: "Mia Brown", email: "mia@shoplane.com", amount: 796, status: "Pending", paymentStatus: "Pending", date: "2026-05-22", items: ["Studio Smart Watch", "Everyday Hoodie"], shippingAddress: "Chicago, USA" },
  { id: "INV-5004", orderId: "ORD-1004", customer: "Liam Davis", email: "liam@shoplane.com", amount: 154, status: "Cancelled", paymentStatus: "Refunded", date: "2026-05-18", items: ["Travel Bottle Kit"], shippingAddress: "Seattle, USA" },
  { id: "INV-5005", orderId: "ORD-1005", customer: "Sophia Wilson", email: "sophia@shoplane.com", amount: 963, status: "Delivered", paymentStatus: "Paid", date: "2026-05-17", items: ["Ceramic Serveware Set", "Canvas Street Backpack"], shippingAddress: "Denver, USA" },
  { id: "INV-5006", orderId: "ORD-1006", customer: "Ethan Miller", email: "ethan@shoplane.com", amount: 620, status: "Shipped", paymentStatus: "Paid", date: "2026-05-16", items: ["Velvet Lip Set", "Everyday Hoodie"], shippingAddress: "Portland, USA" },
]

export const invoices = orders.map((order, index) => ({
  id: order.id,
  invoiceNo: `INV-2026-${100 + index}`,
  orderId: order.orderId,
  customer: order.customer,
  amount: order.amount,
  status: order.paymentStatus === "Paid" ? "Paid" : order.paymentStatus,
  dueDate: order.date,
  issuedAt: order.date,
  email: order.email,
  items: order.items,
  shippingAddress: order.shippingAddress,
}))

export const topProducts = [
  { name: "Everyday Hoodie", revenue: 1450, units: 53 },
  { name: "Apex Wireless Headphones", revenue: 1260, units: 40 },
  { name: "Studio Smart Watch", revenue: 940, units: 27 },
  { name: "Canvas Street Backpack", revenue: 860, units: 22 },
  { name: "Ceramic Serveware Set", revenue: 620, units: 16 },
]

export const monthlyRevenue = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 14500 },
  { month: "Mar", value: 11800 },
  { month: "Apr", value: 16400 },
  { month: "May", value: 19200 },
  { month: "Jun", value: 21000 },
]

export const orderMetrics = [
  { label: "Pending", value: 14 },
  { label: "Shipped", value: 28 },
  { label: "Delivered", value: 61 },
  { label: "Cancelled", value: 7 },
]

export const userGrowth = [
  { month: "Jan", value: 240 },
  { month: "Feb", value: 280 },
  { month: "Mar", value: 315 },
  { month: "Apr", value: 372 },
  { month: "May", value: 430 },
  { month: "Jun", value: 498 },
]