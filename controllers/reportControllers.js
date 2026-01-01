import OrderModel from "../models/OrdersModel.js";

export const dailySalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to dates are required" });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const report = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ["completed", "shipped"] },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const salesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    // 1️⃣ Validate input
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to dates are required",
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    // 2️⃣ Validate date format
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    endDate.setHours(23, 59, 59, 999);

    // 3️⃣ Aggregation pipeline
    const report = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ["completed", "shipped"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ]);

    // 4️⃣ Safe fallback if no data found
    const result = report[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    };

    // 5️⃣ Final response
    res.status(200).json({
      success: true,
      period: { from, to },
      summary: result,
    });

  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
