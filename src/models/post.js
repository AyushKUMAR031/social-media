const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, NOW(), false)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at`,
    [user_id, content, media_url, comments_enabled],
  );

  return result.rows[0];
};

const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [postId],
  );

  return result.rows[0] || null;
};

const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );

  return result.rowCount > 0;
};

// TODO: Implement getFeedPosts function that returns posts from followed users
// This should include pagination and ordering by creation date
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     JOIN follows f ON f.followed_id = p.user_id
     WHERE f.follower_id = $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};



// TODO: Implement updatePost function for editing posts

// TODO: Implement searchPosts function for content search

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
};
