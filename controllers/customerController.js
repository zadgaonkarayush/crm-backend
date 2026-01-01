import CustomerModel from "../models/CustomerModel.js";
import UserModel from "../models/UserModel.js";

export const createCustomer = async (req, res) => {
  try {
    let owner = req.user._id;
    if(
      (req.user.role === "admin" || req.user.role === "manager") &&
      req.body.salesId
    ){
      owner = req.body.salesId
    }
    const customer = await CustomerModel.create({
      ...req.body,
      createdBy: owner,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findById(id)
      .populate("createdBy", "name email role");
      
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await CustomerModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};
export const updateCustomer = async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (req.user.role === "sales") {
      query.createdBy = req.user._id;
    }

    if (req.user.role === "manager") {
      const salesUser = await UserModel.find({
        managerId: req.user._id,
        role: "sales",
      }).select("_id");
      query.createdBy = { $in: salesUser };
    }

    const customer = await CustomerModel.find(query)
      .populate("createdBy", "name email role")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await CustomerModel.countDocuments(query);
    res.json({
      data: customer,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};
