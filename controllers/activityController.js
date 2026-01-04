import ActivityLogModel from "../models/ActivityLogModel.js";
import UserModel from "../models/UserModel.js";

export const getActivityLogs = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "sales") {
      query.performedBy = req.user._id;
    }

    if (req.user.role === "manager") {
      const salesUser = await UserModel.find({
        managerId: req.user._id,
      }).select("_id");

      query.performedBy = { $in: salesUser };
    }
    const logs = await ActivityLogModel.find(query)
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
