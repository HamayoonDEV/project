import authController from "../controller/authControlller.js";
import express from "express";
import auth from "../middleWare/auth.js";
import blogController from "../controller/blogController.js";
import commentController from "../controller/commentController.js";

const router = express.Router();
//authController endPoints
router.post("/register", authController.regiseter);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
router.get("/refresh", authController.resfresh);

//blogController endPoints
router.post("/blog", auth, blogController.createBlog);
router.get("/blog/all", auth, blogController.getAll);
router.get("/blog/:id", auth, blogController.getBlogById);
router.put("/blog/update", auth, blogController.updateBlog);
router.delete("/blog/delete/:id", auth, blogController.delete);

//commentController endPoints
router.post("/comment", auth, commentController.createComment);
router.get("/comment/all/:blogId", auth, commentController.getCommentsByBlogId);
router.delete("/comment/delete/:id", auth, commentController.deleteComment);

export default router;
