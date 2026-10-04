// Sample business data for the demo. Replace with the restaurant's final menu.
export const menuDetails = [
  { price: 395, vegetarian: true, note: "The original", ingredients: "Tomato, fior di latte, fresh basil & extra virgin olive oil." },
  { price: 495, vegetarian: false, note: "A little heat", ingredients: "Tomato, fior di latte, pepperoni & a touch of chilli." },
  { price: 525, vegetarian: true, note: "Rich & mellow", ingredients: "Fior di latte, parmesan, gorgonzola & smoked provolone." },
  { price: 445, vegetarian: true, note: "Garden to oven", ingredients: "Tomato, mozzarella, mushrooms, peppers, olives & basil." },
];

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const demoLocation = {
  name: "The neighbourhood oven",
  address: "12 Olive Lane, New Delhi",
  hours: "Every day · 12:00–22:00",
};
