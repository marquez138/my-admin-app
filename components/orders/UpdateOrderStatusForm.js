// /components/orders/UpdateOrderStatusForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const availableStatuses = ['Pending', 'Reviewed', 'Quoted', 'Processing', 'Completed', 'Cancelled'];

export default function UpdateOrderStatusForm({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // OPTION 1: Using an API Route
      const res = await fetch(`/api/orders/${orderId}`, { // You'll need to create this API route
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      // OPTION 2: Using a Server Action (more modern for App Router)
      // const result = await updateOrderStatusAction(orderId, status); // You'd define this server action

      const data = await res.json(); // Assuming API route for now

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Order status updated successfully!' });
        router.refresh(); // Re-fetches data for the current page (Server Components)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update status.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message.text && <p style={{ color: message.type === 'error' ? 'red' : 'green', marginBottom: '10px' }}>{message.text}</p>}
      <label htmlFor="status" style={{marginRight: '10px'}}>New Status:</label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc'}}
      >
        {availableStatuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button type="submit" disabled={loading || status === currentStatus} style={{padding: '8px 15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  );
}