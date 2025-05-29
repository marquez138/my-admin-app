// /app/api/orders/[orderId]/route.js
import dbConnect from '../../../../lib/dbConnect'; // Adjust path
import Order from '../../../../models/Order';       // Adjust path
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; // For auth check
import { authOptions } from '../../../../lib/authOptions'; // Adjust path

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ success: false, error: 'Not authenticated or not an admin.' }, { status: 401 });
  }

  const { orderId } = params;
  const { status } = await request.json();

  if (!status || !['Pending', 'Reviewed', 'Quoted', 'Processing', 'Completed', 'Cancelled'].includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid status value.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() }, // Manually set updatedAt here if pre-hook isn't reliable for findByIdAndUpdate
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: 'Server error updating order.' }, { status: 500 });
  }
}