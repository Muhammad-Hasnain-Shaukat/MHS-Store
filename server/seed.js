import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const createCategory = async (name, parentId = null) => {
  const category = await Category.create({ name, slug: slugify(name), parent: parentId });
  return category;
};

const runSeed = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    // ---- Category tree ----
    const home = await createCategory("Home");
    const furniture = await createCategory("Furniture", home._id);
    const homeAccessories = await createCategory("Accessories", home._id);
    const decor = await createCategory("Decor", home._id);

    const clothing = await createCategory("Clothing");
    const kids = await createCategory("Kids", clothing._id);
    const men = await createCategory("Men", clothing._id);
    const women = await createCategory("Women", clothing._id);
    const menShirts = await createCategory("Shirts", men._id);
    const menShoes = await createCategory("Shoes", men._id);
    const womenDresses = await createCategory("Dresses", women._id);
    const womenBags = await createCategory("Bags", women._id);
    const kidsToys = await createCategory("Toys", kids._id);

    const electronics = await createCategory("Electronics");
    const audio = await createCategory("Audio", electronics._id);
    const wearables = await createCategory("Wearables", electronics._id);

    // ---- Products (each with multiple image angles) ----
    const sampleProducts = [
      {
        name: "Ceramic Pour-Over Coffee Set",
        description: "Hand-glazed ceramic pour-over dripper with matching mug.",
        price: 34.99,
        category: decor._id,
        images: [
          "https://loremflickr.com/700/500/coffee,ceramic?lock=101",
          "https://loremflickr.com/700/500/coffee,ceramic?lock=102",
          "https://loremflickr.com/700/500/coffee,ceramic?lock=103",
        ],
        stock: 20,
        rating: 4.8,
      },
      {
        name: "Oak Accent Chair",
        description: "Solid oak frame accent chair with woven seat and backrest.",
        price: 189.0,
        category: furniture._id,
        images: [
          "https://loremflickr.com/700/500/chair,furniture?lock=104",
          "https://loremflickr.com/700/500/chair,furniture?lock=105",
          "https://loremflickr.com/700/500/chair,furniture?lock=106",
        ],
        stock: 12,
        rating: 4.6,
      },
      {
        name: "Classic Leather Wallet",
        description: "Handcrafted genuine leather wallet with 6 card slots and a coin pocket.",
        price: 24.99,
        category: homeAccessories._id,
        images: [
          "https://loremflickr.com/700/500/wallet,leather?lock=107",
          "https://loremflickr.com/700/500/wallet,leather?lock=108",
        ],
        stock: 40,
        rating: 4.5,
      },
      {
        name: "Men's Oxford Button-Down Shirt",
        description: "Breathable cotton Oxford shirt with a tailored fit, perfect for work or weekends.",
        price: 32.0,
        category: menShirts._id,
        images: [
          "https://loremflickr.com/700/500/shirt,menswear?lock=109",
          "https://loremflickr.com/700/500/shirt,menswear?lock=110",
          "https://loremflickr.com/700/500/shirt,menswear?lock=111",
        ],
        stock: 60,
        rating: 4.3,
      },
      {
        name: "Men's Leather Sneakers",
        description: "Minimalist white leather sneakers with a cushioned sole.",
        price: 74.99,
        category: menShoes._id,
        images: [
          "https://loremflickr.com/700/500/sneakers,shoes?lock=112",
          "https://loremflickr.com/700/500/sneakers,shoes?lock=113",
          "https://loremflickr.com/700/500/sneakers,shoes?lock=114",
        ],
        stock: 45,
        rating: 4.7,
      },
      {
        name: "Women's Wrap Midi Dress",
        description: "Flowing midi dress with a flattering wrap silhouette, ideal for day to evening.",
        price: 58.0,
        category: womenDresses._id,
        images: [
          "https://loremflickr.com/700/500/dress,fashion?lock=115",
          "https://loremflickr.com/700/500/dress,fashion?lock=116",
        ],
        stock: 30,
        rating: 4.4,
      },
      {
        name: "Women's Structured Tote Bag",
        description: "Spacious structured tote in vegan leather with an interior zip pocket.",
        price: 49.99,
        category: womenBags._id,
        images: [
          "https://loremflickr.com/700/500/handbag,tote?lock=117",
          "https://loremflickr.com/700/500/handbag,tote?lock=118",
        ],
        stock: 25,
        rating: 4.5,
      },
      {
        name: "Wooden Building Blocks Set",
        description: "50-piece natural wood building block set for imaginative play.",
        price: 22.5,
        category: kidsToys._id,
        images: [
          "https://loremflickr.com/700/500/wooden,toys?lock=119",
          "https://loremflickr.com/700/500/wooden,toys?lock=120",
        ],
        stock: 50,
        rating: 4.9,
      },
      {
        name: "Wireless Bluetooth Headphones",
        description: "Over-ear headphones with active noise cancellation and 30-hour battery life.",
        price: 89.99,
        category: audio._id,
        images: [
          "https://loremflickr.com/700/500/headphones?lock=121",
          "https://loremflickr.com/700/500/headphones?lock=122",
          "https://loremflickr.com/700/500/headphones?lock=123",
        ],
        stock: 25,
        rating: 4.7,
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "Compact waterproof speaker with 12-hour playtime and deep bass.",
        price: 39.99,
        category: audio._id,
        images: [
          "https://loremflickr.com/700/500/speaker,bluetooth?lock=124",
          "https://loremflickr.com/700/500/speaker,bluetooth?lock=125",
        ],
        stock: 35,
        rating: 4.4,
      },
      {
        name: "Minimalist Analog Watch",
        description: "Stainless steel watch with a minimalist dial and genuine leather strap.",
        price: 59.99,
        category: wearables._id,
        images: [
          "https://loremflickr.com/700/500/wristwatch?lock=126",
          "https://loremflickr.com/700/500/wristwatch?lock=127",
          "https://loremflickr.com/700/500/wristwatch?lock=128",
        ],
        stock: 30,
        rating: 4.3,
      },
      {
        name: "Fitness Tracker Band",
        description: "Slim fitness band with heart-rate monitoring and 7-day battery life.",
        price: 45.0,
        category: wearables._id,
        images: [
          "https://loremflickr.com/700/500/smartwatch,fitness?lock=129",
          "https://loremflickr.com/700/500/smartwatch,fitness?lock=130",
        ],
        stock: 40,
        rating: 4.2,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`Categories created, ${sampleProducts.length} sample products inserted`);

    const adminExists = await User.findOne({ email: "admin@mhsstore.com" });
    if (!adminExists) {
      await User.create({
        name: "MHS Admin",
        email: "admin@mhsstore.com",
        password: "Admin@123",
        role: "admin",
      });
      console.log("Admin user created -> email: admin@mhsstore.com | password: Admin@123");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeed();
