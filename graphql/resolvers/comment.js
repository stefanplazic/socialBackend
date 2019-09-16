const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const user = async userId => {
  try {
    const user = await User.find({_id:userId});
    return {
      ...user._doc,
      _id: user._id
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
    commentsByPost: async (args) => {
      try {
        const post = await Post.find({_id:args.postId,isDeleted:false});
        if(post == null){
        throw new Error('Post does not exists.');
      }
        /*select all comments*/
        const comments = await Comment.find({post:args.postId});
        return comments.map(comment => {
          return {
              ...comment._doc
          };
        });
      } catch (err) {
        throw err;
      }
    },
    /*create comment for given post*/
    createComment: async (args, req) => {

      const comment = new Comment({
        post: args.commentInput.postId,
        content: args.commentInput.content,
        author:req.locals.user._id
      });
      try {
        //check if post exists
        const post = await Post.find({_id:args.commentInput.postId,isDeleted:false});
        if(post == null){
          throw new Error('Post does not exists.');
        }
        const result = await comment.save();  
        return {
          ...result._doc,
          _id: result.id,
          author: user.bind(this, result.author)
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    
  /*delete post*/
    deleteComment: async (args, req) => {
    try {
      //find the comment and check if user if owner

      const comment = await Comment.findById(args.commentId);
      if(comment == null || comment.author != req.locals.user._id){
        throw new Error('No such comment!');
      }
      //delete the comment
      await Comment.findByIdAndRemove(args.commentId);
      return true;
    } catch (err) {
      throw err;
    }
  }
  };
  