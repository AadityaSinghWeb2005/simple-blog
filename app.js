const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('express').urlencoded({ extended: true });
const methodOverride = require('method-override');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser);
app.use(methodOverride('_method'));

// Mongoose Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Routes

// Index - List all posts
app.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' });
  res.render('index', { posts });
});

// New - Form to create a new post
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// Create - Post a new blog post
app.post('/posts', async (req, res) => {
  await Post.create(req.body.post);
  res.redirect('/');
});

// Show - Display a specific post
app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('show', { post });
});

// Edit - Form to edit an existing post
app.get('/posts/:id/edit', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', { post });
});

// Update - Update an existing post
app.put('/posts/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body.post);
  res.redirect(`/posts/${req.params.id}`);
});

// Delete - Delete a blog post
app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});