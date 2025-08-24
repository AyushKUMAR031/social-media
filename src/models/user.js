const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");
 
//User model for database operations

const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name],
  );

  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};


const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// findUsersByName function for search functionality
// This should support partial name matching and pagination
const findUsersByName = async (searchTerm, limit = 10, offset = 0) => {
  const result = await query(
    `SELECT id, username, email, full_name, created_at
     FROM users
     WHERE username ILIKE $1 OR full_name ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );

  return result.rows;
};


// Implement getUserProfile function that includes follower/following counts
const getUserProfile = async (userId) => {
  const user = await query(
    `SELECT 
      u.id,
      u.username,
      u.full_name,
      u.email,
      (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) AS follower_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count
    FROM users u
    WHERE u.id = $1`,
    [userId]
  );
  return user.rows[0] || null;
};

// Update user profile
const updateUserProfile = async (userId, { username, email, full_name }) => {
  // Dynamically build SET clause
  const fields = [];
  const values = [];
  let idx = 1;

  if (username) {
    fields.push(`username = $${idx++}`);
    values.push(username);
  }
  if (email) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }
  if (full_name) {
    fields.push(`full_name = $${idx++}`);
    values.push(full_name);
  }

  if (fields.length === 0) return null; // when i have nothing to update

  values.push(userId); // last parameter for WHERE
  const queryText = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, username, email, full_name, created_at`;

  const result = await query(queryText, values);
  return result.rows[0] || null;
};


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};
