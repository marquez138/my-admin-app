// // /models/ProductImport.js
// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   category: {
//     type: String,
//     required: true,
//     enum: ['t-shirts', 'hoodies', 'tank-tops', 'mugs', 'hats', 'stickers'],
//   },
//   description: { type: String, required: true },
//   basePrice: { type: Number, required: true },
//   availableColors: [{ name: String, hex: String }],
//   availableSizes: [{ type: String }],
//   defaultImage: { type: String, required: true },
//   customizable: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);