const express = require('express');
const router = express.Router();

const { createPost, getPosts, deletePost } = require("../controllers/posts");
const { protect } = require('../middlewares/auth');

// Create post (protected)
router.post("/", protect, createPost);

// Get all posts (public)
router.get("/", getPosts);

// Delete specific post by ID (protected)
router.delete("/:id", protect, deletePost);

module.exports = router;
