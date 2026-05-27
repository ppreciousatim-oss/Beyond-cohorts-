const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

// Support both 'author' and 'user' fields for backwards compatibility
postSchema.pre('save', async function() {
  if (!this.author && this.user) {
    this.author = this.user;
  }
  // no next() needed
});


module.exports = mongoose.model('Post', postSchema);