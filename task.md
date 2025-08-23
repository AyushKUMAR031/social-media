# Backend Task – Social Media Platform

## Overview

You will be working on the backend of a basic social media platform.
A foundational codebase has already been implemented, including authentication and content creation features.
Your task is to debug existing issues, complete unfinished functionalities, and enhance the API behavior as outlined below.

---

## Features to Implement

- [ ] **User**
  - [ ] Create a user profile
  - [ ] Login to the created profile
  - [ ] Unique identifier for each user
  - [ ] Authentication mechanism
  - [ ] Searchable by name/unique identifier
  - [ ] Follow/unfollow other users
- [ ] **Post/Content**
  - [ ] Create content (text and/or media)
  - [ ] Posts appear in followers’ feed
  - [ ] Like and comment functionalities
  - [ ] View likes and comments on your own posts
- [ ] **Content Feed**
  - [ ] Personalized feed for each user
  - [ ] Includes:
    - [ ] Posts by followed users
    - [ ] Posts created by the user
  - [ ] Show number of likes and comments on each post
- [ ] **Like**
  - [ ] Users can like posts
  - [ ] One like per user per post
  - [ ] Ability to unlike a post
- [ ] **Comment**
  - [ ] Users can comment on posts (theirs or others’)
  - [ ] Add, edit, delete comments
  - [ ] Comments disabled if the post creator chooses so

---

## API Endpoints

1. **Authentication**

   * User authentication
   * Return JWT token for further requests

2. **Find People (GET)**

   * Search users by name

3. **Follow People (POST)**

   * Follow/unfollow users
   * Fetch follower stats

4. **Content Feed (GET)**

   * Fetch posts from followed users

5. **Content Details (GET)**

   * Fetch details of a single post

6. **Comment (GET/POST)**

   * CRUD for comments on posts

7. **Like (GET/POST)**

   * CRUD for likes on posts

8. **Create Content (POST/DELETE)**

   * Create or delete posts

---

## Deliverables

- [ ] Updated **`schema.sql`** file
- [ ] **ER Diagram**
- [ ] **API Documentation**

  - [ ] Postman collection or Markdown file with request/response examples
- [ ] Source Code

  - [ ] Shared via Google Drive (ZIP file, exclude `node_modules`)
- [ ] Hosted API URL (Heroku, Render, Netlify, etc.)
- [ ] Loom video walkthrough (\~3-5 minutes):

  - [ ] Bugs identified and fixed
  - [ ] Features completed/extended
  - [ ] How AI was used for development
  - [ ] (Optional) Brief overview of code and file structure

---

## Submission Instructions

**Email To:** `internship@toddleapp.com`
**Subject:** `<Your Name> - <College shortname> - Backend Task`

**Include:**

1. Google Drive link to source code ZIP (with correct sharing permissions)
2. Hosted URL of API
3. Loom video walkthrough
4. Updated schema.sql and ER diagram
5. API documentation

---