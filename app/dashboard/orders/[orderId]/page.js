// /app/dashboard/orders/[orderId]/page.js
import dbConnect from '../../../../lib/dbConnect'; // Adjust path
import Order from '../../../../models/Order';       // Adjust path
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UpdateOrderStatusForm from '../../../../components/orders/UpdateOrderStatusForm'; // Client Component

async function getOrder(orderId) {
  await dbConnect();
  const order = await Order.findById(orderId).populate('items.productId', 'name defaultImage slug').lean();
  if (!order) {
    return null;
  }
  return JSON.parse(JSON.stringify(order));
}

export async function generateMetadata({ params }) {
    const order = await getOrder(params.orderId);
    if (!order) return { title: 'Order Not Found' };
    return { title: `Order Details - ...${params.orderId.slice(-6)}` };
}


export default async function SingleOrderPage({ params }) {
  const { orderId } = params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div>
      <Link href="/dashboard/orders" style={{ marginBottom: '20px', display: 'inline-block' }}>&larr; Back to All Orders</Link>
      <h1>Order Details (ID: ...{order._id.slice(-8)})</h1>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date Placed:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</p>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Customer Information</h2>
        <p><strong>Name:</strong> {order.customerInfo.name}</p>
        <p><strong>Email:</strong> {order.customerInfo.email}</p>
        {order.customerInfo.phone && <p><strong>Phone:</strong> {order.customerInfo.phone}</p>}
        {order.customerInfo.company && <p><strong>Company:</strong> {order.customerInfo.company}</p>}
        {order.notes && <p><strong>Overall Notes:</strong> {order.notes}</p>}


        <h2 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Items Requested ({order.totalQuantity})</h2>
        {order.items.map((item, index) => (
          <div key={index} style={{ border: '1px solid #f0f0f0', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
            <h4>
              {item.productId?.slug ? (
                  <Link href={`/dashboard/products/${item.productId.slug}` }/* Adjust if you have product view/edit page */ style={{color: '#0070f3'}}>
                      {item.productName} (ID: ...{item.productId._id.toString().slice(-6)})
                  </Link>
              ) : (
                  `${item.productName} (Product ID: ...${item.productId._id.toString().slice(-6)})`
              )}
            </h4>
            <p>Quantity: {item.quantity}</p>
            {item.size && <p>Size: {item.size}</p>}
            {item.color && <p>Color: {item.color.name} <span style={{display: 'inline-block', width: '15px', height: '15px', backgroundColor: item.color.hex, border: '1px solid #999', marginLeft: '5px', verticalAlign: 'middle'}}></span></p>}
            {item.customizationImage && (
              <div>
                <p>Custom Image:</p>
                <img src={item.customizationImage} alt="Customization" style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            )}
            {item.notes && <p>Item Notes: <em>{item.notes}</em></p>}
          </div>
        ))}

        <h2 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Update Order Status</h2>
        <UpdateOrderStatusForm orderId={order._id} currentStatus={order.status} />
      </div>
    </div>
  );
}