import asyncHandler from "../middlewares/asyncHandler.js"
import { stateDetails } from "./tax.js";


const taxRate = stateDetails.taxRate;

// const calculateItemsSalesTax = (items, taxRate ) => {
//   return items.map(item => {
//     const product = {
//       product: item.productId,
//       quantity: item.quantity,
//       purchasePrice: item.purchasePrice || 0,
//       totalPrice: item.purchasePrice * item.quantity || 0,
//       totalTax: (item.purchasePrice * item.quantity * taxRate) || 0,
//       priceWithTax: (item.purchasePrice * item.quantity * (1 + taxRate)) || 0,
//     };
//     return product;
//   });
// };
 

const calculateItemsSalesTax = (items, taxRate) => {
  return items.map(item => {
    const purchasePrice = parseFloat(item.price);
    const quantity = parseFloat(item.quantity);

    if (isNaN(purchasePrice) || isNaN(quantity) || quantity <= 0) {
      throw new Error(`Invalid price or quantity for item: ${item.productId}`);
    }

    const totalPrice = purchasePrice * quantity;
    const totalTax = totalPrice * (taxRate / 100);
    const priceWithTax = totalPrice + totalTax;

    const product = {
      product: item.productId,
      quantity: quantity,
      purchasePrice: purchasePrice,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      priceWithTax: parseFloat(priceWithTax.toFixed(2)),
    };

    return product;
  });
};









       


export default  calculateItemsSalesTax ;