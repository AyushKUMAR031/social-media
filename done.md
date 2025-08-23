# Project Completion Summary

This document outlines the process and key steps undertaken to complete the backend tasks for the social media platform, including debugging, feature implementation, and API documentation.

---

## Critical Bugs Fixed

### 1. Password Hashing Bug
- **Issue:** Plain password inserted into the database instead of hashed password.  
- **File:** `src/controllers/users.js`  
- **Fix:** Updated query to use `hashedPassword` from `bcrypt.hash` before insertion.

### 2. Token Verification Bug
- **Issue:** `jwt.verify(token, token)` used token as secret, causing verification failures.  
- **File:** `src/middleware/auth.js`  
- **Fix:** Replaced second argument with secret key (`process.env.JWT_SECRET`).

### 3. Post Creation & Deletion Bug
- **Issue:** Posts created with `is_deleted = true`, deletion logic reversed.  
- **File:** `src/models/post.js`  
- **Fix:** `createPost` now sets `is_deleted = false`; `deletePost` sets `is_deleted = true`.

### 4. Feed Pagination NaN Bug
- **Issue:** `/api/posts/feed` threw `invalid input syntax for type integer: "NaN"` when `page` or `limit` query params were missing or invalid.  
- **File:** `src/controllers/posts.js`  
- **Fix:** Added `isNaN` checks and default values for `page` and `limit` in `getFeed` controller.

---

## Detailed Process:

### 1. Initial Setup & Context Understanding
- **Action:** Established the project context, understood the folder structure, and reviewed the `task.md` document to identify core requirements and existing functionalities.

### 2. User Routes & Postman Testing (Initial)
- **Task:** Explained how to test existing user-related routes (`/api/users/:userId/follow`, `/api/users/:userId/unfollow`, `/api/users/:userId/followers`, `/api/users/:userId/following`).
- **Debugging:**
    - **Issue:** User reported incorrect URIs, specifically regarding the `userId` path parameter.
    - **Investigation:** Read `src/controllers/users.js` and `src/middleware/auth.js`.
    - **Finding:** Discovered that `userId` for follow/unfollow was expected in the request body, and for getting followers/following, it was derived from the authenticated user (`req.user.id`). The `/:userId` in the route definitions was misleading.
    - **Resolution:** Provided corrected Postman instructions, clarifying the actual request structure (e.g., `POST /api/users/follow` with `userId` in body).

### 3. Postman Collection (`docs/api-collection.json`) Updates
- **Task:** Updated the Postman collection to reflect implemented features and improve automation.
- **Process:**
    - Added a new "Users" collection with requests for follow, unfollow, get followers, and get following, using the corrected URIs.
    - Implemented variables (`{{base_url}}`, `{{token}}`, `{{target_user_id}}`) for dynamic values in requests.
    - Removed the "Posts" collection as per user's request to keep only "Auth" and "Users" initially.
    - Updated "Authentication" requests to use variables for `username`, `email`, `password`, and `full_name` for registration and login.
- **Challenges:** Faced repeated issues with `write_file` operations due to user cancellations or file state discrepancies, requiring multiple attempts to ensure changes persisted.

### 4. "Create Content" Feature
- **Task:** Assessed the implementation status of content creation.
- **Process:**
    - Reviewed `POST /api/posts` route in `src/routes/posts.js`.
    - Examined `create` function in `src/controllers/posts.js`.
    - Checked `createPostSchema` in `src/utils/validation.js` for expected request body fields (`content`, `media_url`, `comments_enabled`).
    - Verified `createPost` function in `src/models/post.js` and `posts` table schema in `sql/schema.sql`.
- **Finding:** Confirmed that the "Create Content" feature was already fully implemented and functional.

### 5. Postman Testing of Posts Routes
- **Task:** Provided instructions for testing existing post-related routes (`GET /api/posts/my`, `GET /api/posts/:post_id`, `GET /api/posts/user/:user_id`, `DELETE /api/posts/:post_id`).
- **Debugging:**
    - **Issue:** Identified a bug in `getMyPosts` controller (`src/controllers/posts.js`) where it incorrectly tried to get `user_id` from `req.params` instead of `req.user.id`.
    - **Resolution:** Proposed and applied a fix to change `const { user_id: userId } = req.params;` to `const userId = req.user.id;`.
    - **Confirmation:** User later confirmed the fix resolved the issue.

### 6. "Posts appear in followers’ feed" Feature
- **Task:** Implemented the content feed functionality.
- **Process:**
    - Identified `TODO` comments for `getFeed` route, controller, and `getFeedPosts` model function.
    - **Route:** Uncommented `router.get("/feed", authenticateToken, getFeed);` in `src/routes/posts.js`.
    - **Model:** Ensured `getFeedPosts` was exported from `src/models/post.js`.
    - **Debugging:**
        - **Issue:** User reported "invalid input syntax for type integer: 'NaN'" error when testing `/feed`.
        - **Investigation:** Traced the error to `page` or `limit` query parameters potentially being `NaN` when passed to the database.
        - **Resolution:** Applied a robust parsing fix in `getFeed` controller (`src/controllers/posts.js`) using `isNaN` checks to ensure `page` and `limit` are always valid numbers.
        - **Issue:** User reported `getFeedPosts` was not found.
        - **Investigation:** Discovered `getFeedPosts` was not imported into `src/controllers/posts.js`.
        - **Resolution:** Added `getFeedPosts` to the import statement in `src/controllers/posts.js`.

### 7. "Like and comment functionalities" Feature
- **Task:** Implemented full like and comment features.
- **Process:**
    - **Likes Implementation:**
        - **Model (`src/models/like.js`):** Implemented `createLike`, `deleteLike`, `getLikesByPostId`, `getLikedPostsByUserId`, `hasUserLikedPost`.
        - **Controller (`src/controllers/likes.js`):** Implemented `likePost`, `unlikePost`, `getLikesForPost`, `getLikedPostsByUser`.
        - **Routes (`src/routes/likes.js`):** Defined `POST /api/likes`, `DELETE /api/likes/:post_id`, `GET /api/likes/post/:post_id`, `GET /api/likes/user/:user_id`.
    - **Comments Implementation:**
        - **Model (`src/models/comment.js`):** Implemented `addComment`, `editComment`, `removeComment`, `getCommentsByPostId`.
        - **Controller (`src/controllers/comments.js`):** Implemented `createComment`, `updateComment`, `deleteComment`, `getCommentsForPost`.
        - **Routes (`src/routes/comments.js`):** Defined `POST /api/comments`, `PUT /api/comments/:comment_id`, `DELETE /api/comments/:comment_id`, `GET /api/comments/post/:post_id`.
    - **Debugging:**
        - **Issue:** User reported "route not found" for like/comment routes.
        - **Investigation:** Discovered `likes` and `comments` routers were not mounted in `src/app.js`.
        - **Resolution:** Added `app.use("/api/comments", commentRoutes);` and `app.use("/api/likes", likeRoutes);` to `src/app.js`.

### 8. "View likes and comments on your own posts" Feature
- **Task:** Enhanced post retrieval to show like/comment counts.
- **Process:**
    - Modified `getPostById`, `getPostsByUserId`, and `getFeedPosts` functions in `src/models/post.js` to include `like_count` and `comment_count` in their SQL queries.
- **Clarification:** Explained that this feature provides counts, not full details, and that separate endpoints exist for full details. User accepted this scope.

### 9. "Content Feed" Completion (Final)
- **Task:** Ensured the content feed includes user's own posts.
- **Process:** Modified `getFeedPosts` in `src/models/post.js` to use `UNION ALL` to combine posts from followed users and the authenticated user's own posts.

### 10. Final `TODO` Review
- **Task:** Searched for remaining `TODO` comments in the codebase.
- **Findings:**
    - **Misleading `TODO`s (removed):** Comments for `getFeed` controller and `getFeedPosts` model function were removed as they were already implemented.
    - **Unimplemented `TODO`s (noted):** `TODO`s related to `updatePost` and `searchPosts` (controller, model, route) remain, as they were outside the current scope.
    - **User Model `TODO`s (to be investigated):** `TODO`s in `src/models/user.js` for `findUsersByName`, `getUserProfile`, and `updateUserProfile` were identified for future assessment.

## Current Status:
All core features outlined in the "Features to Implement" section of `task.md` have been completed and debugged. The API documentation (Postman collection) has been updated accordingly.

## Next Steps (Manual for User):
- Review and update `schema.sql` (no changes were required for implemented features).
- Create ER Diagram.
- Prepare source code for submission.
- Deploy and provide Hosted API URL.
- Record Loom video walkthrough.
