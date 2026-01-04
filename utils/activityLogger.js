import ActivityLogModel from "../models/ActivityLogModel.js";

export const logActivity = async({
    action,
    entityType,
    entityId,
    message,
    user,
})=>{
try{
    await ActivityLogModel.create({
        action,
        entityType,
        entityId,
        message,
        performedBy:user._id,
        role:user.role,
        managerId: user.managerId || null,
    })

}catch(error){
    console.error("Activity log error:", error.message);
}
}