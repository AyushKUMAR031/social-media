// TODO: Implement users controller
// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

const logger = require("../utils/logger");
const { findUsersByName } = require("../models/user");

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

// TODO: Implement follow function
// TODO: Implement unfollow function
// TODO: Implement getMyFollowing function
// TODO: Implement getMyFollowers function

module.exports = {
	searchUsers,
};
