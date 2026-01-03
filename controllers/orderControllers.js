import mongoose from "mongoose";
import OrderModel from "../models/OrdersModel.js";
import ProductModel from "../models/ProductModel.js";
import { generateInvoicePDF } from "../utils/invoice.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession(); ///for order if 1 success and 2 failed and order reduced from one but not order success(inconsistency)
  try {
    session.startTransaction();
    const { customer, lines } = req.body;
    let total = 0;

    for (const line of lines) {
      const product = await ProductModel.findById(line.product).session(
        session,
      );
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with id ${line.product} not found` });
      }
      if (product.stock < line.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product ${product.name}` });
      }
      product.stock -= line.quantity;
      await product.save({ session });

      total += line.quantity * line.price + (line.tax || 0);
    }
    const order = await OrderModel.create(
      [
        {
          customer,
          createdBy: req.user.id,
          lines,
          total,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id)
      .populate("customer")
      .populate("createdBy", "name role")
      .populate("lines.product", "name sku price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const query = {};

    const { role, _id } = req.user;

    // 🔐 ROLE-BASED VISIBILITY
    if (role === "sales") {
      // Sales can see only their own orders
      query.createdBy = _id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }
    const orders = await OrderModel.find(query)
      .populate("customer", "name email company phone")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const generateInvoice = async(req,res)=>{
    try{
        const order = await OrderModel.findById(req.params.id)
        .populate("customer")
        .populate("lines.product");

        
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    generateInvoicePDF(order,res);

    }catch(error){
        res.status(500).json({error:error.message});
    }
}