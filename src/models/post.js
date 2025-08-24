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

// Implement getFeedPosts function that returns posts from followed users
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



// Implement updatePost function for editing posts
const updatePost = async (postId, userId, { content, media_url, comments_enabled }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (content !== undefined) {
    fields.push(`content = $${idx++}`);
    values.push(content);
  }
  if (media_url !== undefined) {
    fields.push(`media_url = $${idx++}`);
    values.push(media_url);
  }
  if (comments_enabled !== undefined) {
    fields.push(`comments_enabled = $${idx++}`);
    values.push(comments_enabled);
  }

  if (fields.length === 0) return null; //nothing to update

  values.push(postId, userId); // last parameters for where
  const queryText = `
    UPDATE posts 
    SET ${fields.join(", ")}, updated_at = NOW() 
    WHERE id = $${idx++} AND user_id = $${idx} 
    RETURNING *
  `;

  const result = await query(queryText, values);
  return result.rows[0] || null;
};


// Implement searchPosts function for content search
const searchPosts = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );

  return result.rows;
};


module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
