const { query } = require("../utils/database");

/**
 * Like model for managing post likes
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

const deleteLike = async ({ user_id, post_id }) => {
  const result = await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [user_id, post_id],
  );
  return result.rowCount > 0;
};

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
