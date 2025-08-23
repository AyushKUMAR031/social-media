const logger = require("../utils/logger");
const { createLike, deleteLike, getLikesByPostId, getLikedPostsByUserId } = require("../models/like");
const { getPostById } = require("../models/post"); // To check if post exists

// Like a post
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;

    // Check if post exists
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const like = await createLike({ user_id: userId, post_id });
    logger.verbose(`User ${userId} liked post ${post_id}`);
    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    logger.critical("Like post error:", error);
    if (error.code === '23505') { 
      // Unique violation error code for PostgreSQL
      return res.status(409).json({ error: "You have already liked this post" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;

    const success = await deleteLike({ user_id: userId, post_id: parseInt(post_id) });

    if (!success) {
      return res.status(404).json({ error: "Like not found or already unliked" });
    }

    logger.verbose(`User ${userId} unliked post ${post_id}`);
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get likes for a post
const getLikesForPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const likes = await getLikesByPostId(parseInt(post_id));
    res.json({ likes });
  } catch (error) {
    logger.critical("Get likes for post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get posts liked by a user
const getLikedPostsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const posts = await getLikedPostsByUserId(parseInt(user_id));
    res.json({ posts });
  } catch (error) {
    logger.critical("Get liked posts by user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikesForPost,
  getLikedPostsByUser,
};
