const { createPost, getPostById, getPostsByUserId, deletePost, getFeedPosts, updatePost, searchPosts} = require("../models/post.js");
const logger = require("../utils/logger");

//create a new post
const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled } = req.validatedData;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
    });

    logger.verbose(`User ${userId} created post ${post.id}`);

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    logger.critical("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get a single post by id
const getById = async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await getPostById(parseInt(post_id));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get posts by a specific user
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(parseInt(user_id), limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get current user's posts
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete a post
const remove = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;

    const success = await deletePost(parseInt(post_id), userId);

    if (!success) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted post ${post_id}`);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// getFeed controller for feed content from users post and followed users posts
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1) {
      limit = 20;
    }

    const offset = (page - 1) * limit;

    const posts = await getFeedPosts(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement updatePost controller for editing posts
const editPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;
    const { content, media_url, comments_enabled } = req.validatedData;

    const updatedPost = await updatePost(parseInt(post_id), userId, {
      content,
      media_url,
      comments_enabled,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or no changes provided" });
    }

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    logger.critical("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement searchPosts controller for searching posts by content
const search = async (req, res) => {
  try {
    const { q } = req.query;
    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) page = 1;

    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1) limit = 20;

    const offset = (page - 1) * limit;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const posts = await searchPosts(q, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Search posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  editPost,
  search,
};
