const express = require("express");
const { validateRequest, createPostSchema , updatePostSchema } = require("../utils/validation");
const { create, getById, getUserPosts, getMyPosts, remove, getFeed , editPost, search} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();


//Posts routes

// POST /api/posts - Create a new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// GET /api/posts/my - Get current user's posts
router.get("/my", authenticateToken, getMyPosts);

// GET /api/posts/feed - Get posts from followed users
router.get("/feed", authenticateToken, getFeed);

// GET /api/posts/search?q=term - Search posts
router.get("/search", optionalAuth, search)

// GET /api/posts/user/:user_id - Get posts by a specific user
router.get("/user/:user_id", optionalAuth, getUserPosts);

// GET /api/posts/:post_id - Get a single post by ID
router.get("/:post_id", optionalAuth, getById);

// DELETE /api/posts/:post_id - Delete a post
router.delete("/:post_id", authenticateToken, remove);

// PUT /api/posts/:post_id - Update a post
router.put("/:post_id", authenticateToken, validateRequest(updatePostSchema), editPost);

;

module.exports = router;
