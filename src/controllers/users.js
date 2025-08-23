const logger = require("../utils/logger");
const { findUsersByName, getUserById } = require("../models/user");
const { followUser, unfollowUser, getFollowing, getFollowers,getFollowCounts,} = require("../models/follow");

const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10, offset = 0 } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const users = await findUsersByName(q, limit, offset);

    res.json({ results: users });
  } catch (error) {
    logger.critical("Search users error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followedId } = req.body;

    if (followerId === followedId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const userToFollow = await getUserById(followedId);
    if (!userToFollow) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    await followUser(followerId, followedId);

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    logger.critical("Follow user error:", error.message);
    if (error.constraint === "follows_pkey") {
      return res.status(400).json({ error: "You are already following this user" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followedId } = req.body;

    await unfollowUser(followerId, followedId);

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    logger.critical("Unfollow user error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);
    res.json({ following });
  } catch (error) {
    logger.critical("Get following error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    logger.critical("Get followers error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const stats = await getFollowCounts(userId);
    res.json(stats);
  } catch (error) {
    logger.critical("Get follow stats error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  searchUsers,
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
};