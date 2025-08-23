---

  Revised Postman Instructions (based on controller logic):

  To test these routes, you'll need:
   1. A running backend server. (Default: http://localhost:3000)
   2. A valid JWT (JSON Web Token). Obtain this by logging in or registering a user through the /api/auth/login or /api/auth/register routes.

  Common Steps for all requests:
   * Base URL: http://localhost:3000
   * User API Base Path: /api/users
   * Headers: Add a header:
       * Key: Authorization
       * Value: Bearer YOUR_JWT_TOKEN_HERE (Replace YOUR_JWT_TOKEN_HERE with your actual JWT).

  ---

  Here are the corrected instructions for each route:

  1. Follow a user
   * Method: POST
   * URL: http://localhost:3000/api/users/follow
       * Note: The /:userId path parameter is removed from the URL because the controller expects the userId in the request body.
   * Body:
       * Select raw and JSON for the body type.
       * Provide the ID of the user you want to follow in the JSON body:
   1         {
   2             "userId": "ID_OF_USER_TO_FOLLOW"
   3         }
          Replace "ID_OF_USER_TO_FOLLOW" with the actual ID of the user you wish to follow.

  2. Unfollow a user
   * Method: DELETE
   * URL: http://localhost:3000/api/users/unfollow
       * Note: The /:userId path parameter is removed from the URL because the controller expects the userId in the request body.
   * Body:
       * Select raw and JSON for the body type.
       * Provide the ID of the user you want to unfollow in the JSON body:

   1         {
   2             "userId": "ID_OF_USER_TO_UNFOLLOW"
   3         }
          Replace "ID_OF_USER_TO_UNFOLLOW" with the actual ID of the user you wish to unfollow.

  3. Get following (of the authenticated user)
   * Method: GET
   * URL: http://localhost:3000/api/users/following
       * Note: The /:userId path parameter is removed from the URL because the controller returns the following list for the authenticated user.
   * Body: No request body is needed.

  4. Get followers (of the authenticated user)
   * Method: GET
   * URL: http://localhost:3000/api/users/followers
       * Note: The /:userId path parameter is removed from the URL because the controller returns the followers list for the authenticated user.
   * Body: No request body is needed.

 Scenario 1: Get follow stats for the authenticated user
   * Method: GET
   * URL: http://localhost:3000/api/users/stats
   * Body: No request body is needed.

  Scenario 2: Get follow stats for a specific user
   * Method: GET
   * URL: http://localhost:3000/api/users/stats/:id
       * Replace :id with the actual ID of the user whose follow stats you want to retrieve.
   * Body: No request body is needed.


----------------------------------------------------------------------------------------------------------------------

 1. Get current user's posts
   * Method: GET
   * URL: http://localhost:3000/api/posts/my
   * Authentication: Required.
   * Note: Due to the bug in the getMyPosts controller mentioned above, this route might not work as expected.

  2. Get a single post by ID
   * Method: GET
   * URL: http://localhost:3000/api/posts/:post_id
       * Replace :post_id with the actual ID of the post you want to retrieve.
   * Authentication: Optional.

  3. Get posts by a specific user
   * Method: GET
   * URL: http://localhost:3000/api/posts/user/:user_id
       * Replace :user_id with the actual ID of the user whose posts you want to retrieve.
   * Authentication: Optional.

  4. Delete a post
   * Method: DELETE
   * URL: http://localhost:3000/api/posts/:post_id
       * Replace :post_id with the actual ID of the post you want to delete.
   * Authentication: Required. (Only the owner of the post can delete it).

-------------------------------------------------------------------------------------------------------------
You can test "Comments disabled if the post creator chooses so" in Postman by following these steps:

   1. Create a post with comments disabled:
       * Method: POST
       * URL: http://localhost:3000/api/posts
       * Headers: Content-Type: application/json, Authorization: Bearer YOUR_JWT_TOKEN_HERE
       * Body (raw, JSON):

   1         {
   2             "content": "This is a post with comments disabled.",
   3             "comments_enabled": false
   4         }
       * Note the id of the post returned in the response.

   2. Attempt to create a comment on that post:
       * Method: POST
       * URL: http://localhost:3000/api/comments
       * Headers: Content-Type: application/json, Authorization: Bearer YOUR_JWT_TOKEN_HERE
       * Body (raw, JSON):

   1         {
   2             "post_id": "THE_ID_FROM_STEP_1",
   3             "content": "Trying to comment on a disabled post."
   4         }
       * Expected Result: You should receive a 403 Forbidden status code with the response: {"error": "Comments are disabled for this post"}.

---------------------------------------------------------------------------------------------------------------------
