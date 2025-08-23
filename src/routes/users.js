const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { searchUsers, follow, unfollow, getMyFollowing, getMyFollowers, getFollowStats} = require("../controllers/users");

const router = express.Router();


//Userroutes on /users

// Search for users by name
router.get("/search", authenticateToken, searchUsers);

// Follow a user
router.post("/follow", authenticateToken, follow);

// Unfollow a user
router.delete("/unfollow", authenticateToken, unfollow);

// Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing);

// Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers);

// Get follow stats for a user
router.get("/stats/:id?", authenticateToken, getFollowStats);


module.exports = router;