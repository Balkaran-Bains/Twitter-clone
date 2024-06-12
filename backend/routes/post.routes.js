import express from "express";
import { protectRoute } from "../middleware/protectRoute.Middleware.js";
import { 
     commentOnPost,
     createPost,
     deletePost,
     getAllPosts,
     getFollowingPosts,
     getLikedPosts,
     getUserPosts,
     likeUnlikePost } from "../controllers/post.controllers.js";


const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

const postRoutes = router;
export default postRoutes;