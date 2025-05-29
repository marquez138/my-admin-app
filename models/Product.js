import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
   name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    required: true,
    enum: ['t-shirts', 'hoodies', 'tank-tops', 'mugs', 'hats', 'stickers'], // Example categories
  },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true }, // Price before customization
  availableColors: [{ type: String }], // e.g., ['Red', 'Blue', 'Black']
  availableSizes: [{ type: String }],  // e.g., ['S', 'M', 'L', 'XL']
  defaultImage: { type: String, required: true }, // URL or path to a default product image
  // Potentially fields for specific customization options if they vary by product
  customizable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);