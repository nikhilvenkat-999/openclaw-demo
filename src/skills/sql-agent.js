/**
 * SQL Agent Skill
 *
 * Converts natural language questions to SQL queries.
 * Uses a mock database for demo purposes.
 *
 * In production, you would connect to:
 * - Azure SQL Database
 * - Azure Synapse Analytics
 * - PostgreSQL, MySQL, etc.
 */

// Mock database tables (simulates real data)
const mockDatabase = {
  customers: [
    { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@company.ae', country: 'UAE', created_at: '2026-02-08', segment: 'Enterprise' },
    { id: 2, name: 'Sara Khan', email: 'sara@business.sa', country: 'KSA', created_at: '2026-02-07', segment: 'SMB' },
    { id: 3, name: 'Mohammed Ali', email: 'mo@startup.ae', country: 'UAE', created_at: '2026-02-09', segment: 'Startup' },
    { id: 4, name: 'Fatima Hassan', email: 'fatima@corp.bh', country: 'Bahrain', created_at: '2026-02-05', segment: 'Enterprise' },
    { id: 5, name: 'Omar Khalid', email: 'omar@tech.kw', country: 'Kuwait', created_at: '2026-02-10', segment: 'SMB' },
    { id: 6, name: 'Layla Ahmed', email: 'layla@global.qa', country: 'Qatar', created_at: '2026-02-06', segment: 'Enterprise' },
    { id: 7, name: 'Yusuf Ibrahim', email: 'yusuf@local.om', country: 'Oman', created_at: '2026-02-04', segment: 'SMB' },
    { id: 8, name: 'Noura Salem', email: 'noura@biz.ae', country: 'UAE', created_at: '2026-02-09', segment: 'Startup' },
  ],

  orders: [
    { id: 1, customer_id: 1, product_id: 1, amount: 15000, status: 'completed', created_at: '2026-02-09' },
    { id: 2, customer_id: 2, product_id: 2, amount: 8500, status: 'completed', created_at: '2026-02-08' },
    { id: 3, customer_id: 1, product_id: 3, amount: 22000, status: 'pending', created_at: '2026-02-10' },
    { id: 4, customer_id: 3, product_id: 1, amount: 15000, status: 'completed', created_at: '2026-02-07' },
    { id: 5, customer_id: 4, product_id: 4, amount: 45000, status: 'completed', created_at: '2026-02-06' },
    { id: 6, customer_id: 5, product_id: 2, amount: 8500, status: 'cancelled', created_at: '2026-02-05' },
    { id: 7, customer_id: 6, product_id: 5, amount: 32000, status: 'completed', created_at: '2026-02-09' },
    { id: 8, customer_id: 7, product_id: 1, amount: 15000, status: 'pending', created_at: '2026-02-10' },
    { id: 9, customer_id: 8, product_id: 3, amount: 22000, status: 'completed', created_at: '2026-02-08' },
    { id: 10, customer_id: 2, product_id: 4, amount: 45000, status: 'completed', created_at: '2026-02-10' },
  ],

  products: [
    { id: 1, name: 'Data Analytics Platform', price: 15000, category: 'Software', stock: 999 },
    { id: 2, name: 'Cloud Migration Service', price: 8500, category: 'Service', stock: 999 },
    { id: 3, name: 'AI Integration Package', price: 22000, category: 'Software', stock: 999 },
    { id: 4, name: 'Enterprise Security Suite', price: 45000, category: 'Software', stock: 999 },
    { id: 5, name: 'Custom Development', price: 32000, category: 'Service', stock: 999 },
  ]
};

// Query patterns and their mock results
const queryPatterns = [
  {
    patterns: ['how many customers', 'customer count', 'total customers'],
    sql: 'SELECT COUNT(*) as total_customers FROM customers',
    execute: () => {
      const count = mockDatabase.customers.length;
      return {
        sql: 'SELECT COUNT(*) as total_customers FROM customers',
        result: `**Total Customers**: ${count}`,
        data: [{ total_customers: count }]
      };
    }
  },
  {
    patterns: ['customers by country', 'customers per country', 'country breakdown'],
    sql: 'SELECT country, COUNT(*) as count FROM customers GROUP BY country',
    execute: () => {
      const byCountry = {};
      mockDatabase.customers.forEach(c => {
        byCountry[c.country] = (byCountry[c.country] || 0) + 1;
      });
      const result = Object.entries(byCountry).map(([country, count]) => ({ country, count }));
      return {
        sql: 'SELECT country, COUNT(*) as count FROM customers GROUP BY country ORDER BY count DESC',
        result: result.map(r => `- ${r.country}: ${r.count}`).join('\n'),
        data: result
      };
    }
  },
  {
    patterns: ['total sales', 'revenue', 'sales amount'],
    sql: 'SELECT SUM(amount) as total_revenue FROM orders WHERE status = "completed"',
    execute: () => {
      const total = mockDatabase.orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.amount, 0);
      return {
        sql: 'SELECT SUM(amount) as total_revenue FROM orders WHERE status = "completed"',
        result: `**Total Revenue**: $${total.toLocaleString()}`,
        data: [{ total_revenue: total }]
      };
    }
  },
  {
    patterns: ['orders', 'recent orders', 'order list'],
    sql: 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5',
    execute: () => {
      const orders = mockDatabase.orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      const result = orders.map(o => {
        const customer = mockDatabase.customers.find(c => c.id === o.customer_id);
        return `- Order #${o.id}: $${o.amount.toLocaleString()} (${o.status}) - ${customer?.name || 'Unknown'}`;
      }).join('\n');
      return {
        sql: 'SELECT o.*, c.name FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.created_at DESC LIMIT 5',
        result: result,
        data: orders
      };
    }
  },
  {
    patterns: ['top products', 'best selling', 'popular products'],
    sql: 'SELECT p.name, COUNT(o.id) as orders, SUM(o.amount) as revenue FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.id ORDER BY revenue DESC',
    execute: () => {
      const productSales = {};
      mockDatabase.orders.forEach(o => {
        const product = mockDatabase.products.find(p => p.id === o.product_id);
        if (product) {
          if (!productSales[product.name]) {
            productSales[product.name] = { orders: 0, revenue: 0 };
          }
          productSales[product.name].orders++;
          productSales[product.name].revenue += o.amount;
        }
      });
      const result = Object.entries(productSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .map(([name, data]) => `- **${name}**: ${data.orders} orders, $${data.revenue.toLocaleString()}`);
      return {
        sql: 'SELECT p.name, COUNT(o.id) as orders, SUM(o.amount) as revenue FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.id ORDER BY revenue DESC',
        result: result.join('\n'),
        data: productSales
      };
    }
  },
  {
    patterns: ['last week', 'this week', 'recent customers', 'new customers'],
    sql: 'SELECT * FROM customers WHERE created_at >= DATE("now", "-7 days")',
    execute: () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recent = mockDatabase.customers.filter(c => new Date(c.created_at) >= weekAgo);
      return {
        sql: 'SELECT * FROM customers WHERE created_at >= DATE("now", "-7 days")',
        result: `**New customers (last 7 days)**: ${recent.length}\n` +
          recent.map(c => `- ${c.name} (${c.country}) - ${c.segment}`).join('\n'),
        data: recent
      };
    }
  }
];

/**
 * Find matching query pattern
 */
function findQueryPattern(query) {
  const lowerQuery = query.toLowerCase();
  return queryPatterns.find(qp =>
    qp.patterns.some(pattern => lowerQuery.includes(pattern))
  );
}

/**
 * Format query result
 */
function formatQueryResult(queryResult) {
  let output = '## 🔍 Query Result\n\n';
  output += '**SQL Query:**\n```sql\n' + queryResult.sql + '\n```\n\n';
  output += '**Result:**\n' + queryResult.result + '\n';
  return output;
}

/**
 * SQL Agent Skill
 */
export const sqlAgent = {
  name: 'sql-agent',
  description: 'Convert natural language to SQL and execute queries',

  /**
   * Initialize the skill
   */
  async init() {
    console.log('   SQL agent initialized with mock database');
    console.log(`     - ${mockDatabase.customers.length} customers`);
    console.log(`     - ${mockDatabase.orders.length} orders`);
    console.log(`     - ${mockDatabase.products.length} products`);
  },

  /**
   * Execute the skill
   */
  async execute(query) {
    // Find matching pattern
    const pattern = findQueryPattern(query);

    if (pattern) {
      const result = pattern.execute();
      return formatQueryResult(result);
    }

    // Default response with schema info
    return `## 📊 Available Data

I can query the following tables:

**customers** (${mockDatabase.customers.length} records)
- id, name, email, country, created_at, segment

**orders** (${mockDatabase.orders.length} records)
- id, customer_id, product_id, amount, status, created_at

**products** (${mockDatabase.products.length} records)
- id, name, price, category, stock

**Example questions:**
- "How many customers do we have?"
- "Show me total sales"
- "Customers by country"
- "Recent orders"
- "Top products"`;
  }
};
