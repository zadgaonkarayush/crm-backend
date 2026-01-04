import CustomerModel from "../models/CustomerModel.js";
import OrderModel from "../models/OrdersModel.js";
import ProductModel from "../models/ProductModel.js";

export const salesCustomerStats = async (req, res) => {
  try {
    const data = await CustomerModel.aggregate([
      {
        $group: {
          _id: "$createdBy", // Sales user ID
          customers: { $sum: 1 }, // Total customers per sales
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sales",
        },
      },
      { $unwind: "$sales" },
      {
        $project: {
          _id: 0,
          salesId: "$sales._id",
          salesName: "$sales.name",
          customers: 1, // ✅ keep customer count
        },
      },
      { $sort: { customers: -1 } },
    ]);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sales-customer stats" });
  }
};

export const monthWiseOrders = async (req, res) => {
  try {
    const data = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch month wise orders" });
  }
};

export const adminSummary = async (req, res) => {
  try {
    const [customers, orders, revenue] = await Promise.all([
      CustomerModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    res.json({
      totalCustomers: customers,
      totalOrders: orders,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const salesProductSales = async (req, res) => {
  try {
    const data = await OrderModel.aggregate([
      { $match: { createdBy: req.user._id } },
      { $unwind: "$lines" },
      {
        $group: {
          _id: "$lines.product",
          quantity: { $sum: "$lines.quantity" },
          amount: {
            $sum: { $multiply: ["$lines.quantity", "$lines.price"] },
          },
        },
      },
    ]);
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch sales product sales data " });
  }
};

export const openOrders = async (req, res) => {
  try {
    const count = await OrderModel.countDocuments({
      createdBy: req.user._id,
      status: { $in: ["pending", "draft"] },
    });
    res.json({ openOrders: count });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch open orders" });
  }
};

export const lowStockProduct = async (req, res) => {
  try {
    const count = await ProductModel.countDocuments({ stock: { $lt: 10 } });
    res.json({ lowStock: count });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
};

export const last7DaysSales = async(req,res)=>{
try{
const start = new Date();
start.setDate(start.getDate()-7);

const data = await OrderModel.aggregate([
    {
        $match:{
            createdBy:req.user._id,
            createdAt:{$gte:start}
        },
    },
    {
     $group:{
      _id:{$dayOfMonth:"createdAt"},
      total:{$sum:"$total"}
     },
    },
]);

res.json(data)
}catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch last 7 days sales" });
}
}