import { Notification } from "../models/notification.models.js";

// Get notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch notifications for the user and populate 'from' field with selected details
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg",
        });

        // Mark all notifications as read for the user
        await Notification.updateMany({ to: userId }, { $set: { read: true } });

        // Respond with the fetched notifications
        res.status(200).json(notifications);
    } catch (error) {
        // Log detailed error message
        console.error("Error in getNotifications function:", error);

        // Respond with internal server error
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete all notifications for a user
const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete all notifications for the user
        await Notification.deleteMany({ to: userId });

        // Respond with success message
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        // Log detailed error message
        console.error("Error in deleteNotifications function:", error);

        // Respond with internal server error
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export {
    getNotifications,
    deleteNotifications
};


// import { Notification } from "../models/notification.models.js";

// const getNotifications = async(req,res)=>{
//     try {
// 		const userId = req.user._id;

// 		const notifications = await Notification.find({ to: userId }).populate({
// 			path: "from",
// 			select: "username profileImg",
// 		});

// 		await Notification.updateMany({ to: userId }, { read: true });

// 		res.status(200).json(notifications);
// 	} catch (error) {
// 		console.log("Error in getNotifications function", error.message);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };

// const deleteNotifications = async(req,res)=>{
//     try {
// 		const userId = req.user._id;

// 		await Notification.deleteMany({ to: userId });

// 		res.status(200).json({ message: "Notifications deleted successfully" });
// 	} catch (error) {
// 		console.log("Error in deleteNotifications function", error.message);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };


// export{
//     getNotifications,
//     deleteNotifications
// }