# API Documentation

## 1. General Info

*   **Base URL**: `/api`
*   **Authentication**: JWT (`Authorization: Bearer <token>`)
*   **Content-Type**: `application/json`

---

## 2. Authentication (`/auth`)

### Register a New User

*   **Endpoint**: `POST /auth/register`
*   **Description**: Registers a new user in the system.
*   **Authentication**: Not required.
*   **Request Body**:
    ```json
    {
      "username": "itachi",
      "email": "itachi@uchiha.com",
      "password": "password123",
      "full_name": "Itachi Uchiha"
    }
    ```
*   **Success Response (`201 Created`)**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "username": "itachi",
        "email": "itachi@uchiha.com",
        "full_name": "Itachi Uchiha"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Response (`500 Internal Server Error`)**:
    ```json
    {
      "error": "Internal server error"
    }
    ```

### Login User

*   **Endpoint**: `POST /auth/login`
*   **Description**: Authenticates a user and returns a JWT token.
*   **Authentication**: Not required.
*   **Request Body**:
    ```json
    {
      "username": "itachi",
      "password": "password123"
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "username": "itachi",
        "email": "itachi@uchiha.com",
        "full_name": "Itachi Uchiha"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Response (`401 Unauthorized`)**:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

### Get Current User Profile

*   **Endpoint**: `GET /auth/profile`
*   **Description**: Retrieves the profile of the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "user": {
        "id": 1,
        "username": "itachi",
        "email": "itachi@uchiha.com",
        "full_name": "Itachi Uchiha",
        "created_at": "2025-08-24T12:00:00Z"
      }
    }
    ```
*   **Error Response (`500 Internal Server Error`)**:
    ```json
    {
      "error": "Internal server error"
    }
    ```

---

## 3. Users (`/users`)

### Search for Users

*   **Endpoint**: `GET /users/search`
*   **Description**: Searches for users by username or full name.
*   **Authentication**: `Bearer Token` required.
*   **Query Parameters**:
    *   `q` (string, required): The search query.
    *   `limit` (integer, optional, default: 10): The number of results to return.
    *   `offset` (integer, optional, default: 0): The number of results to skip for pagination.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "results": [
        {
          "id": 2,
          "username": "sasuke",
          "full_name": "Sasuke Uchiha"
        }
      ]
    }
    ```
*   **Error Response (`400 Bad Request`)**:
    ```json
    {
      "error": "Search query is required"
    }
    ```

### Follow a User

*   **Endpoint**: `POST /users/follow`
*   **Description**: Allows the authenticated user to follow another user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "userId": 2
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "User followed successfully"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: `{ "error": "You cannot follow yourself" }`
    *   `400 Bad Request`: `{ "error": "You are already following this user" }`
    *   `404 Not Found`: `{ "error": "User to follow not found" }`

### Unfollow a User

*   **Endpoint**: `DELETE /users/unfollow`
*   **Description**: Allows the authenticated user to unfollow another user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "userId": 2
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "User unfollowed successfully"
    }
    ```

### Get User's Following List

*   **Endpoint**: `GET /users/following`
*   **Description**: Retrieves the list of users that the authenticated user is following.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "following": [
        {
          "id": 2,
          "username": "sasuke",
          "full_name": "Sasuke Uchiha"
        }
      ]
    }
    ```

### Get User's Followers List

*   **Endpoint**: `GET /users/followers`
*   **Description**: Retrieves the list of users who are following the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "followers": [
        {
          "id": 3,
          "username": "naruto",
          "full_name": "Naruto Uzumaki"
        }
      ]
    }
    ```

### Get Follow Statistics

*   **Endpoint**: `GET /users/stats/:id?`
*   **Description**: Retrieves the follower and following counts for a user. If `:id` is not provided, it defaults to the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "following_count": "15",
      "followers_count": "30"
    }
    ```

### Get Public User Profile

*   **Endpoint**: `GET /users/:userId/profile`
*   **Description**: Retrieves the public profile of any user.
*   **Authentication**: Optional.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "profile": {
        "id": 2,
        "username": "sasuke",
        "full_name": "Sasuke Uchiha",
        "bio": "Avenger.",
        "created_at": "2025-08-24T11:00:00Z",
        "following_count": "1",
        "followers_count": "1000"
      }
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "User not found"
    }
    ```

### Update User Profile

*   **Endpoint**: `PUT /users/profile`
*   **Description**: Allows the authenticated user to update their own profile.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "full_name": "Itachi Uchiha Sensei",
      "bio": "Former Anbu Captain."
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Profile updated successfully",
      "profile": {
        "id": 1,
        "username": "itachi",
        "email": "itachi@uchiha.com",
        "full_name": "Itachi Uchiha Sensei",
        "bio": "Former Anbu Captain."
      }
    }
    ```
*   **Error Response (`400 Bad Request`)**:
    ```json
    {
      "error": "No valid fields to update"
    }
    ```

---

## 4. Posts (`/posts`)

### Create a New Post

*   **Endpoint**: `POST /posts`
*   **Description**: Creates a new post for the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "content": "This is a new post.",
      "media_url": "https://example.com/image.jpg",
      "comments_enabled": true
    }
    ```
*   **Success Response (`201 Created`)**:
    ```json
    {
      "message": "Post created successfully",
      "post": {
        "id": 1,
        "user_id": 1,
        "content": "This is a new post.",
        "media_url": "https://example.com/image.jpg",
        "comments_enabled": true,
        "created_at": "2025-08-24T12:00:00Z"
      }
    }
    ```

### Get a Single Post

*   **Endpoint**: `GET /posts/:post_id`
*   **Description**: Retrieves a single post by its ID.
*   **Authentication**: Optional.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "post": {
        "id": 1,
        "user_id": 1,
        "content": "This is a new post.",
        "media_url": "https://example.com/image.jpg",
        "comments_enabled": true,
        "created_at": "2025-08-24T12:00:00Z",
        "author": {
            "username": "itachi",
            "full_name": "Itachi Uchiha"
        },
        "like_count": "5",
        "comment_count": "2"
      }
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "Post not found"
    }
    ```

### Get Posts by a Specific User

*   **Endpoint**: `GET /posts/user/:user_id`
*   **Description**: Retrieves all posts by a specific user with pagination.
*   **Authentication**: Optional.
*   **Query Parameters**:
    *   `page` (integer, optional, default: 1): The page number.
    *   `limit` (integer, optional, default: 20): The number of posts per page.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "posts": [
        {
          "id": 1,
          "user_id": 2,
          "content": "Another user's post.",
          "created_at": "2025-08-24T13:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "hasMore": false
      }
    }
    ```

### Get Current User's Posts

*   **Endpoint**: `GET /posts/my`
*   **Description**: Retrieves all posts from the authenticated user with pagination.
*   **Authentication**: `Bearer Token` required.
*   **Query Parameters**:
    *   `page` (integer, optional, default: 1): The page number.
    *   `limit` (integer, optional, default: 20): The number of posts per page.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "posts": [
        {
          "id": 1,
          "user_id": 1,
          "content": "This is my post.",
          "created_at": "2025-08-24T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "hasMore": false
      }
    }
    ```

### Get User Feed

*   **Endpoint**: `GET /posts/feed`
*   **Description**: Retrieves the feed for the authenticated user, consisting of their own posts and posts from users they follow.
*   **Authentication**: `Bearer Token` required.
*   **Query Parameters**:
    *   `page` (integer, optional, default: 1): The page number.
    *   `limit` (integer, optional, default: 20): The number of posts per page.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "posts": [
        {
          "id": 2,
          "user_id": 2,
          "content": "A post from someone I follow.",
          "created_at": "2025-08-24T14:00:00Z"
        },
        {
          "id": 1,
          "user_id": 1,
          "content": "My own recent post.",
          "created_at": "2025-08-24T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "hasMore": true
      }
    }
    ```

### Search Posts

*   **Endpoint**: `GET /posts/search`
*   **Description**: Searches for posts containing the query string.
*   **Authentication**: Optional.
*   **Query Parameters**:
    *   `q` (string, required): The search query.
    *   `page` (integer, optional, default: 1): The page number.
    *   `limit` (integer, optional, default: 20): The number of posts per page.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "posts": [
        {
          "id": 1,
          "user_id": 1,
          "content": "This is a new post about Gemini.",
          "created_at": "2025-08-24T12:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "hasMore": false
      }
    }
    ```
*   **Error Response (`400 Bad Request`)**:
    ```json
    {
      "error": "Search query is required"
    }
    ```

### Update a Post

*   **Endpoint**: `PUT /posts/:post_id`
*   **Description**: Updates a post owned by the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "content": "This is the updated content.",
      "media_url": "https://example.com/new_image.jpg",
      "comments_enabled": false
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Post updated successfully",
      "post": {
        "id": 1,
        "user_id": 1,
        "content": "This is the updated content.",
        "media_url": "https://example.com/new_image.jpg",
        "comments_enabled": false,
        "created_at": "2025-08-24T12:00:00Z",
        "updated_at": "2025-08-24T15:00:00Z"
      }
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "Post not found or no changes provided"
    }
    ```

### Delete a Post

*   **Endpoint**: `DELETE /posts/:post_id`
*   **Description**: Deletes a post owned by the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Post deleted successfully"
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "Post not found or unauthorized"
    }
    ```

---

## 5. Likes (`/likes`)

### Like a Post

*   **Endpoint**: `POST /likes`
*   **Description**: Adds a like to a post from the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "post_id": 2
    }
    ```
*   **Success Response (`201 Created`)**:
    ```json
    {
      "message": "Post liked successfully",
      "like": {
        "id": 1,
        "user_id": 1,
        "post_id": 2
      }
    }
    ```
*   **Error Responses**:
    *   `404 Not Found`: `{ "error": "Post not found" }`
    *   `409 Conflict`: `{ "error": "You have already liked this post" }`

### Unlike a Post

*   **Endpoint**: `DELETE /likes/:post_id`
*   **Description**: Removes a like from a post.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Post unliked successfully"
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "Like not found or already unliked"
    }
    ```

### Get Likes for a Post

*   **Endpoint**: `GET /likes/post/:post_id`
*   **Description**: Retrieves the list of users who liked a specific post.
*   **Authentication**: Optional.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "likes": [
        {
          "user_id": 1,
          "username": "itachi"
        },
        {
          "user_id": 3,
          "username": "naruto"
        }
      ]
    }
    ```

### Get Posts Liked by a User

*   **Endpoint**: `GET /likes/user/:user_id`
*   **Description**: Retrieves all posts liked by a specific user.
*   **Authentication**: Optional.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "posts": [
        {
          "id": 5,
          "content": "A post I liked.",
          "author_id": 4,
          "author_username": "sakura"
        }
      ]
    }
    ```

---

## 6. Comments (`/comments`)

### Create a Comment

*   **Endpoint**: `POST /comments`
*   **Description**: Adds a comment to a post.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "post_id": 2,
      "content": "This is a great post!"
    }
    ```
*   **Success Response (`201 Created`)**:
    ```json
    {
      "message": "Comment created successfully",
      "comment": {
        "id": 1,
        "user_id": 1,
        "post_id": 2,
        "content": "This is a great post!",
        "created_at": "2025-08-24T16:00:00Z"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: `{ "error": "Post ID and content are required" }`
    *   `403 Forbidden`: `{ "error": "Comments are disabled for this post" }`
    *   `404 Not Found`: `{ "error": "Post not found" }`

### Update a Comment

*   **Endpoint**: `PUT /comments/:comment_id`
*   **Description**: Updates a comment owned by the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Request Body**:
    ```json
    {
      "content": "This is an updated comment."
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Comment updated successfully",
      "comment": {
        "id": 1,
        "user_id": 1,
        "post_id": 2,
        "content": "This is an updated comment.",
        "created_at": "2025-08-24T16:00:00Z",
        "updated_at": "2025-08-24T16:05:00Z"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: `{ "error": "Content is required" }`
    *   `404 Not Found`: `{ "error": "Comment not found or unauthorized" }`

### Delete a Comment

*   **Endpoint**: `DELETE /comments/:comment_id`
*   **Description**: Deletes a comment owned by the authenticated user.
*   **Authentication**: `Bearer Token` required.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "Comment deleted successfully"
    }
    ```
*   **Error Response (`404 Not Found`)**:
    ```json
    {
      "error": "Comment not found or unauthorized"
    }
    ```

### Get Comments for a Post

*   **Endpoint**: `GET /comments/post/:post_id`
*   **Description**: Retrieves all comments for a specific post.
*   **Authentication**: Optional.
*   **Success Response (`200 OK`)**:
    ```json
    {
      "comments": [
        {
          "id": 1,
          "user_id": 1,
          "content": "This is a great post!",
          "author": {
            "username": "itachi"
          },
          "created_at": "2025-08-24T16:00:00Z"
        }
      ]
    }
    ```