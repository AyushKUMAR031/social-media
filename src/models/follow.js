const { query } = require("../utils/database");

// Follow model for managing user relationships

const followUser = async (followerId, followedId) => {
  await query(
    "INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)",
    [followerId, followedId]
  );
};

const unfollowUser = async (followerId, followedId) => {
  await query(
    "DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2",
    [followerId, followedId]
  );
};


const getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM users u
     JOIN follows f ON u.id = f.followed_id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return result.rows;
};


const getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.followed_id = $1`,
    [userId]
  );
  return result.rows;
};

const getFollowCounts = async (userId) => {
  const followingResult = await query(
    "SELECT COUNT(*) FROM follows WHERE follower_id = $1",
    [userId]
  );
  const followersResult = await query(
    "SELECT COUNT(*) FROM follows WHERE followed_id = $1",
    [userId]
  );

  return {
    following: parseInt(followingResult.rows[0].count, 10),
    followers: parseInt(followersResult.rows[0].count, 10),
  };
};


module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
};