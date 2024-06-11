import express from "express"
import { protectRoute } from "../middleware/protectRoute.Middleware.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.post("/update",protectRoute,updateUser)
 


const userRoutes = router;
export default userRoutes;