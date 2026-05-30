export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = [
  "All",
  "Coffee",
  "Tea",
  "Pastries",
  "Sandwiches",
  "Drinks",
];

export const products: Product[] = [
  { id: "1", name: "Espresso", price: 3.5, category: "Coffee", emoji: "☕" },
  { id: "2", name: "Cappuccino", price: 4.5, category: "Coffee", emoji: "☕" },
  { id: "3", name: "Latte", price: 5.0, category: "Coffee", emoji: "🥛" },
  { id: "4", name: "Americano", price: 3.75, category: "Coffee", emoji: "☕" },
  { id: "5", name: "Mocha", price: 5.5, category: "Coffee", emoji: "🍫" },
  { id: "6", name: "Cold Brew", price: 4.75, category: "Coffee", emoji: "🧊" },
  { id: "7", name: "Green Tea", price: 3.25, category: "Tea", emoji: "🍵" },
  { id: "8", name: "Chai Latte", price: 4.75, category: "Tea", emoji: "🍵" },
  { id: "9", name: "Earl Grey", price: 3.0, category: "Tea", emoji: "🫖" },
  { id: "10", name: "Matcha Latte", price: 5.25, category: "Tea", emoji: "🍃" },
  { id: "11", name: "Croissant", price: 3.75, category: "Pastries", emoji: "🥐" },
  { id: "12", name: "Muffin", price: 3.5, category: "Pastries", emoji: "🧁" },
  { id: "13", name: "Bagel", price: 4.0, category: "Pastries", emoji: "🥯" },
  { id: "14", name: "Scone", price: 3.25, category: "Pastries", emoji: "🍪" },
  { id: "15", name: "Cinnamon Roll", price: 4.5, category: "Pastries", emoji: "🌀" },
  { id: "16", name: "Club Sandwich", price: 8.5, category: "Sandwiches", emoji: "🥪" },
  { id: "17", name: "BLT", price: 7.75, category: "Sandwiches", emoji: "🥓" },
  { id: "18", name: "Grilled Cheese", price: 6.5, category: "Sandwiches", emoji: "🧀" },
  { id: "19", name: "Wrap", price: 7.25, category: "Sandwiches", emoji: "🌯" },
  { id: "20", name: "Orange Juice", price: 4.0, category: "Drinks", emoji: "🍊" },
  { id: "21", name: "Smoothie", price: 6.0, category: "Drinks", emoji: "🥤" },
  { id: "22", name: "Lemonade", price: 3.75, category: "Drinks", emoji: "🍋" },
  { id: "23", name: "Sparkling Water", price: 2.5, category: "Drinks", emoji: "💧" },
];
