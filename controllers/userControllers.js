import UserModel from "../models/UserModel.js";

export const getAllUsers =async(req,res)=>{
    try{
      const loggedUser = req.user;
      let users=[];

        if (loggedUser.role === "sales") {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    if(loggedUser.role === 'admin'){
        users = await UserModel.find()
        .select("-password")
        .populate("managerId","name email")
    }
     if(loggedUser.role === 'manager'){
        users = await UserModel.find({
            role:"sales",
            createdBy:loggedUser._id
        }).select("-password")
      }
      res.json({
        count:users.length,
        users
      })

    }catch(error){
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
    }
}

export const deleteUser =async(req,res)=>{
  try{
    const loggedUser = req.user;
    const {id} = req.params;

    // ❌ Sales cannot delete anyone
    if (loggedUser.role === "sales") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const userToDelete = await UserModel.findById(id);

    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await UserModel.findByIdAndDelete(id);

     res.status(200).json({
      message: "User deleted successfully",
    });
    

  }catch(error){
     res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
}
export const bulkDeleteUser =async(req,res)=>{
  try{
    const loggedUser = req.user;
    const {userIds} = req.body;

    if(!Array.isArray(userIds) || userIds.length===0){
       return res.status(400).json({
        message: "userIds must be a non-empty array",
      });
    }

    // ❌ Sales cannot delete anyone
    if (loggedUser.role === "sales") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const userToDelete = await UserModel.find({
      _id:{$in:userIds},
    })

     if (userToDelete.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }
  

    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    for(const user of userToDelete){
      if(
        loggedUser.role === "admin" && 
        user._id.toString() === loggedUser._id.toString()
      ){
        return res.status(400).json({
          message: "Admin cannot delete himself",
        });
      }
    }
     
     const result = await UserModel.deleteMany({
      _id: { $in: userIds },
    });
    res.status(200).json({
      message: "User deleted successfully",
       deletedCount: result.deletedCount
    });


  }catch(error){
     res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
}