* ✅ All endpoints
* ✅ Whether they need `Authorization: Bearer <token>`
* ✅ Expected request body/query params
* ✅ Actual response JSON (from controllers)
* ✅ Error cases where relevant

---

Here’s how I’d structure your `API_DOCUMENTATION.md`:

## 1. General Info

* **Base URL**: `https://your-api-host.com/api`
* **Auth**: JWT (`Authorization: Bearer <token>`)
* **Content-Type**: `application/json`
* Pagination: `/posts/feed?page=1&limit=20`

---

## 2. Authentication (`/auth`)

* `POST /auth/register` → Register user
* `POST /auth/login` → Login user
* `GET /auth/profile` → Get current user profile

Example **register** response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "itachi",
    "email": "itachi@uchiha.com",
    "full_name": "Itachi Uchiha"
  },
  "token": "jwt_token_here"
}
```

---

## 3. Users (`/users`)

* `GET /users/search?q=term` → Search users
* `POST /users/follow` → Follow user (`{ "userId": 2 }`)
* `DELETE /users/unfollow` → Unfollow user (`{ "userId": 2 }`)
* `GET /users/following` → Get my following
* `GET /users/followers` → Get my followers
* `GET /users/stats/:id?` → Get follow stats
* `GET /users/:userId/profile` → Public profile
* `PUT /users/profile` → Update profile

Example **follow** success:

```json
{ "message": "User followed successfully" }
```

---

## 4. Posts (`/posts`)

* `POST /posts` → Create new post
* `GET /posts/my` → My posts
* `GET /posts/feed` → Feed (my + following)
* `GET /posts/search?q=hello` → Search posts
* `GET /posts/user/:user_id` → Posts by user
* `GET /posts/:post_id` → Single post
* `PUT /posts/:post_id` → Update post
* `DELETE /posts/:post_id` → Delete post

Example **create post** request:

```json
{
  "content": "Hello world",
  "media_url": "https://example.com/image.png",
  "comments_enabled": true
}
```

Response:

```json
{
  "message": "Post created successfully",
  "post": {
    "id": 5,
    "user_id": 1,
    "content": "Hello world",
    "media_url": "https://example.com/image.png",
    "comments_enabled": true,
    "created_at": "2025-08-24T12:00:00Z"
  }
}
```

---

## 5. Likes (`/likes`)

* `POST /likes` → Like post (`{ "post_id": 5 }`)
* `DELETE /likes/:post_id` → Unlike
* `GET /likes/post/:post_id` → Get likes for post
* `GET /likes/user/:user_id` → Posts liked by user

Example:

```json
{
  "message": "Post liked successfully",
  "like": { "user_id": 1, "post_id": 5 }
}
```

---

## 6. Comments (`/comments`)

* `POST /comments` → Create comment (`{ "post_id": 5, "content": "Nice post!" }`)
* `PUT /comments/:comment_id` → Update comment
* `DELETE /comments/:comment_id` → Delete comment
* `GET /comments/post/:post_id` → Get comments for post

Example response:

```json
{
  "message": "Comment created successfully",
  "comment": {
    "id": 10,
    "user_id": 1,
    "post_id": 5,
    "content": "Nice post!",
    "created_at": "2025-08-24T12:10:00Z"
  }
}
```
