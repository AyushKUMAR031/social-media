const { query } = require("../utils/database");

//Comment model for managing post comments

const addComment = async ({ user_id, post_id, content }) => {
  const result = await query(
    `INSERT INTO comments (user_id, post_id, content, created_at, is_deleted)
     VALUES ($1, $2, $3, NOW(), FALSE)
     RETURNING id, user_id, post_id, content, created_at, is_deleted`,
    [user_id, post_id, content],
  );
  return result.rows[0];
};

const editComment = async ({ comment_id, user_id, content }) => {
  const result = await query(
    `UPDATE comments
     SET content = $3, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id, user_id, post_id, content, created_at, updated_at, is_deleted`,
    [comment_id, user_id, content],
  );
  return result.rows[0] || null;
};

const removeComment = async ({ comment_id, user_id }) => {
  const result = await query(
    `UPDATE comments
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [comment_id, user_id],
  );
  return result.rowCount > 0;
};

// Get comments for a post by post ID
const getCommentsByPostId = async (post_id) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1 AND c.is_deleted = FALSE
     ORDER BY c.created_at ASC`,
    [post_id],
  );
  return result.rows;
};

module.exports = {
  addComment,
  editComment,
  removeComment,
  getCommentsByPostId,
};
