// /app/dashboard/orders/page.js
import dbConnect from '../../../lib/dbConnect'; // Adjust path
import Order from '../../../models/Order';     // Adjust path
import Product from '../../../models/Product'; // <--- ADD THIS IMPORT
import Link from 'next/link';
// import OrderTable from '../../../components/orders/OrderTable'; // You'd create this client component

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

async function getOrders(page = 1, limit = 10) {
  await dbConnect();
  // The import of Product above ensures Mongoose knows about the 'Product' model here
  const skip = (page - 1) * limit;
  const orders = await Order.find({})
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .populate('items.productId', 'name defaultImage slug') // Added slug for linking
                            .lean();
  const totalOrders = await Order.countDocuments({});
  return { orders: JSON.parse(JSON.stringify(orders)), totalOrders, totalPages: Math.ceil(totalOrders / limit) };
}

// ... rest of your ManageOrdersPage component code remains the same ...
export default async function ManageOrdersPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const { orders, totalOrders, totalPages } = await getOrders(page);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Orders ({totalOrders})</h1>
        {/* Add New Order button if needed */}
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {/* ... table structure ... */}
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={tableCellStyle} title={order._id}>
                    <Link href={`/dashboard/orders/${order._id}`} style={{ color: '#0070f3', textDecoration: 'underline' }}>
                      ...{order._id.slice(-8)}
                    </Link>
                  </td>
                  <td style={tableCellStyle}>{order.customerInfo.name}</td>
                  {/* ... other cells ... */}
                </tr>
              ))}
            </tbody>
          </table>
          {/* ... pagination ... */}
        </>
      )}
    </div>
  );
}

const tableHeaderStyle = { border: '1px solid #ddd', padding: '10px', textAlign: 'left' };
const tableCellStyle = { border: '1px solid #ddd', padding: '10px' };
// ... getStatusColor function ...