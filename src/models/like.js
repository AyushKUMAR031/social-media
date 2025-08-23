const { query } = require("../utils/database");

/**
 * Like model for managing post likes
  */

/**
 * Create a new like
 * @param {Object} likeData - Like data (user_id, post_id)
 * @returns {Promise<Object>} Created like
 */
const createLike = async ({ user_id, post_id }) => {
  const result = await query(
    `INSERT INTO likes (user_id, post_id, created_at)
     VALUES ($1, $2, NOW())
     RETURNING user_id, post_id, created_at`,
    [user_id, post_id],
  );
  return result.rows[0];
};

/**
 * Delete a like
 * @param {Object} likeData - Like data (user_id, post_id)
 * @returns {Promise<boolean>} True if like was deleted, false otherwise
 */
const deleteLike = async ({ user_id, post_id }) => {
  const result = await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [user_id, post_id],
  );
  return result.rowCount > 0;
};

/**
 * Get likes for a post by post ID
 * @param {number} post_id - Post ID
 * @returns {Promise<Array>} Array of like objects
 */
const getLikesByPostId = async (post_id) => {
  const result = await query(
    `SELECT l.user_id, u.username, u.full_name, l.created_at
     FROM likes l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1
     ORDER BY l.created_at DESC`,
    [post_id],
  );
  return result.rows;
};

/**
 * Get posts liked by a user
 * @param {number} user_id - User ID
 * @returns {Promise<Array>} Array of post objects liked by the user
 */
const getLikedPostsByUserId = async (user_id) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN likes l ON p.id = l.post_id
     JOIN users u ON p.user_id = u.id
     WHERE l.user_id = $1 AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC`,
    [user_id],
  );
  return result.rows;
};

/**
 * Check if a user has liked a post
 * @param {Object} likeData - Like data (user_id, post_id)
 * @returns {Promise<boolean>} True if user has liked the post, false otherwise
 */
const hasUserLikedPost = async ({ user_id, post_id }) => {
  const result = await query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [user_id, post_id],
  );
  return result.rowCount > 0;
};

module.exports = {
  createLike,
  deleteLike,
  getLikesByPostId,
  getLikedPostsByUserId,
  hasUserLikedPost,
};
