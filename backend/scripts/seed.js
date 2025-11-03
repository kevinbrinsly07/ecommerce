require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

async function seedProducts() {
  const products = [
    {
      name: 'Aurora Wireless Headphones',
      slug: 'aurora-wireless-headphones',
      description: 'Comfort-fit Bluetooth headphones with rich bass and 30-hour battery life.',
      category: 'Audio',
      brand: 'Apex',
      tags: ['headphones', 'wireless', 'bluetooth'],
      sku: 'AUR-HP-001',
      price: 99.99,
      salePrice: 79.99,
      currency: 'USD',
      stock: 24,
      featured: true,
      image: '../images/placeholder.png',
      images: ['/images/products/aurora-1.jpg', '/images/products/aurora-2.jpg'],
      highlights: ['Active noise cancellation', 'Comfort fit', 'Fast charging'],
      attributes: [
        { key: 'Driver Size', value: '40mm' },
        { key: 'Bluetooth', value: '5.3' },
      ],
      ratingAverage: 4.7,
      ratingCount: 120,
    },
    {
      name: 'Nimbus Smartwatch Pro',
      slug: 'nimbus-smartwatch-pro',
      description: 'Smartwatch with AMOLED display, GPS, and heart-rate tracking.',
      category: 'Wearables',
      brand: 'Nimbus',
      sku: 'NIM-SW-002',
      price: 199.0,
      salePrice: 169.0,
      stock: 40,
      image: '../images/placeholder.png',
      highlights: ['AMOLED Display', 'Water Resistant 5ATM', 'Heart Rate Monitor'],
      attributes: [
        { key: 'Battery Life', value: '7 days' },
        { key: 'Display Size', value: '1.65 inch' },
      ],
      ratingAverage: 4.5,
      ratingCount: 87,
    },
    {
      name: 'Vertex Mechanical Keyboard 87',
      slug: 'vertex-mechanical-keyboard-87',
      description: 'Compact TKL mechanical keyboard with RGB backlight and hot-swap keys.',
      category: 'Accessories',
      brand: 'Vertex',
      sku: 'VTX-KB-087',
      price: 129.0,
      stock: 15,
      image: '../images/placeholder.png',
      highlights: ['RGB Backlight', 'Hot-swappable keys', 'PBT keycaps'],
      attributes: [
        { key: 'Layout', value: 'TKL (87 keys)' },
        { key: 'Switch Type', value: 'Linear (Silent)' },
      ],
      ratingAverage: 4.6,
      ratingCount: 64,
    },
    {
      name: 'Glide Portable SSD 1TB',
      slug: 'glide-portable-ssd-1tb',
      description: 'High-speed 1TB portable SSD with USB-C 10Gbps performance.',
      category: 'Storage',
      brand: 'Glide',
      sku: 'GLD-SSD-1TB',
      price: 119.0,
      salePrice: 99.0,
      stock: 33,
      image: '../images/placeholder.png',
      highlights: ['Shock Resistant', 'Aluminum Body', 'USB-C 3.2 Gen 2'],
      ratingAverage: 4.8,
      ratingCount: 230,
    },
    {
      name: 'Terra Insulated Bottle 1L',
      slug: 'terra-insulated-bottle-1l',
      description: 'Vacuum insulated stainless bottle keeps drinks cold for 24h.',
      category: 'Lifestyle',
      brand: 'Terra',
      sku: 'TRA-BT-1L',
      price: 24.0,
      stock: 120,
      image: '../images/placeholder.png',
      highlights: ['Leak-proof cap', 'BPA-Free', 'Powder-coated finish'],
      ratingAverage: 4.2,
      ratingCount: 300,
    }
    ,
    {
      name: 'Luna 4K Smart TV 55-inch',
      slug: 'luna-4k-smart-tv-55',
      description: '55-inch UHD Smart TV with HDR10+, Dolby Audio, and built-in streaming apps.',
      category: 'Electronics',
      brand: 'LunaTech',
      sku: 'LUN-TV-55UHD',
      price: 599.0,
      salePrice: 529.0,
      stock: 18,
      image: '../images/placeholder.png',
      highlights: ['4K UHD Display', 'HDR10+', 'Dolby Audio', 'Smart Remote'],
      attributes: [
        { key: 'Screen Size', value: '55 inch' },
        { key: 'Resolution', value: '3840x2160' },
      ],
      ratingAverage: 4.5,
      ratingCount: 143,
    },
    {
      name: 'Aero Drone X200',
      slug: 'aero-drone-x200',
      description: 'Lightweight camera drone with 4K video recording and GPS-assisted flight.',
      category: 'Drones',
      brand: 'AeroFly',
      sku: 'AER-DR-200',
      price: 299.0,
      salePrice: 259.0,
      stock: 22,
      image: '../images/placeholder.png',
      highlights: ['4K Camera', 'GPS Return Home', 'Foldable Design'],
      attributes: [
        { key: 'Battery Life', value: '40 min' },
        { key: 'Control Range', value: '2 km' },
      ],
      ratingAverage: 4.3,
      ratingCount: 88,
    },
    {
      name: 'Pulse Gaming Mouse RGB',
      slug: 'pulse-gaming-mouse-rgb',
      description: 'Ergonomic gaming mouse with customizable RGB lighting and 16000 DPI sensor.',
      category: 'Accessories',
      brand: 'PulseTech',
      sku: 'PLS-MS-RGB',
      price: 49.99,
      salePrice: 39.99,
      stock: 75,
      image: '../images/placeholder.png',
      highlights: ['16000 DPI Sensor', 'RGB Lighting', 'Adjustable Weight'],
      attributes: [
        { key: 'Connection', value: 'Wired USB' },
        { key: 'Buttons', value: '8 programmable' },
      ],
      ratingAverage: 4.4,
      ratingCount: 152,
    },
    {
      name: 'Echo Portable Bluetooth Speaker',
      slug: 'echo-portable-speaker',
      description: 'Compact wireless speaker with deep bass, IPX7 waterproof, and 20-hour playtime.',
      category: 'Audio',
      brand: 'EchoSound',
      sku: 'ECO-SP-007',
      price: 59.99,
      salePrice: 49.99,
      stock: 90,
      image: '../images/placeholder.png',
      highlights: ['IPX7 Waterproof', '20-hour Playtime', 'Deep Bass'],
      attributes: [
        { key: 'Bluetooth Version', value: '5.1' },
        { key: 'Charging Port', value: 'USB-C' },
      ],
      ratingAverage: 4.6,
      ratingCount: 245,
    },
    {
      name: 'Zen Laptop Backpack 25L',
      slug: 'zen-laptop-backpack-25l',
      description: 'Durable and lightweight backpack with padded laptop compartment and USB port.',
      category: 'Lifestyle',
      brand: 'ZenCraft',
      sku: 'ZEN-BP-25L',
      price: 39.99,
      salePrice: 34.99,
      stock: 150,
      image: '../images/placeholder.png',
      highlights: ['Water Resistant', 'USB Charging Port', 'Ergonomic Straps'],
      attributes: [
        { key: 'Capacity', value: '25L' },
        { key: 'Material', value: 'Polyester' },
      ],
      ratingAverage: 4.1,
      ratingCount: 102,
    }
  ];

  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();