import mongoose from "mongoose";

const{schema} =mongoose;


const cartItemSchema = new schema({

product:{
    type:schema.Types.objectId,
    ref:'product'
},
quantity:Number,

purchasePrice:{
    type:Number,
    default:0
},

totalPrice:{
    type:Number,
    default:0
},
priceWithTax:{
    type:Number,
    default:0
},
totalTax:{
    type:Number,
    default:0
},
status:{
    type:String,
    default: "Not_processed",
   enum:[
     "Not_processed",
     "Processing",
     "Shipped",
     "Delivered",
     "Cancelled"
   ]
}

})



const cartSchema = new schema ({

    products:[cartItemSchema],
    user: {
        type:schema.Types.objectId,
        ref:'User'
    },

    updated:Date,
    created:{
        type:Date,
        default:Date.now
    }

})


const CartItem  = mongoose.model('CartItem',cartItemSchema);

const CartSchema = mongoose.model('cart',cartSchema);





export {CartItem,CartSchema }