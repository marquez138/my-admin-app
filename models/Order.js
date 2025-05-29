import mongoose from 'mongoose';

const CustomizedProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true }, // Denormalized for easier display
  color: { type: String },
  size: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  customizationImage: { type: String }, // URL to the uploaded image on S3
  // notes: { type: String } // Optional notes from user for this item
});

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    // Add other relevant customer details
  },
  items: [CustomizedProductSchema],
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Reviewed', 'Quoted', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  notes: { type: String }, // General notes for the whole order
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);