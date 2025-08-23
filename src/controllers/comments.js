const logger = require("../utils/logger");
const { addComment, editComment, removeComment, getCommentsByPostId } = require("../models/comment");
const { getPostById } = require("../models/post");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, content } = req.body;

    if (!post_id || !content) {
      return res.status(400).json({ error: "Post ID and content are required" });
    }

    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.comments_enabled) {
      return res.status(403).json({ error: "Comments are disabled for this post" });
    }

    const comment = await addComment({ user_id: userId, post_id, content });
    logger.verbose(`User ${userId} commented on post ${post_id}`);
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing comment
const updateComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const updatedComment = await editComment({ comment_id: parseInt(comment_id), user_id: userId, content });

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    logger.verbose(`User ${userId} updated comment ${comment_id}`);
    res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;

    const success = await removeComment({ comment_id: parseInt(comment_id), user_id: userId });

    if (!success) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted comment ${comment_id}`);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get comments for a post
const getCommentsForPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const comments = await getCommentsByPostId(parseInt(post_id));
    res.json({ comments });
  } catch (error) {
    logger.critical("Get comments for post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsForPost,
};
