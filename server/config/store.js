import asyncHandler from "../middlewares/asyncHandler"
import { stateDetails } from "./tax";


const caculateItemsSalesTax = asyncHandler(async(items)=>{

try {
    const taxRate = stateDetails.stateTaxRate;

  const products = items.map(item => {
    item.priceWithTax = 0;
    item.totalPrice = 0;
    item.totalTax = 0;
    item.purchasePrice = item.price;

    const price = item.purchasePrice;
    const quantity = item.quantity;
    item.totalPrice = parseFloat(Number((price * quantity).toFixed(2)));

    if (item.taxable) {
      const taxAmount = price * (taxRate / 100) * 100;

      item.totalTax = parseFloat(Number((taxAmount * quantity).toFixed(2)));
      item.priceWithTax = parseFloat(
        Number((item.totalPrice + item.totalTax).toFixed(2))
      );
    }

    return item;
  });

  return products;
    
} catch (error) {
    res.status(500).json({ message: "Server error", error });
    
}




})
 
       


export default  caculateItemsSalesTax ;