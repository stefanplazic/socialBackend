const Post = require('../../models/post');
const User = require('../../models/user');

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
    posts: async () => {
      try {
        const posts = await Post.find({isDeleted:false});
        return posts.map(post => {
          return {
              ...post._doc,
              _id: post.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    createPost: async (args, req) => {
      const post = new Post({
        title: args.postInput.title,
        filePath: args.postInput.filePath,
        isDeleted:false,
        author:req.locals.user._id
      });
      let createdPost;
      try {
        const result = await post.save();  
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
    /*update post*/
    updatePost: async (args, req) => {
    try {
      const post = await Post.findById(args.postId);
      if(post == null || req.locals.user._id != post.author){
        throw new Error('Error occurred');
      }
      //update post
      var options = {title:args.postInput.title,filePath:args.postInput.filePath};
      const result = await Post.findOneAndUpdate({_id:args.postId}, options, {new: true}).populate({ path: 'author', select: 'username avatar _id'}).exec();
      return{
          ...result._doc,
            _id: result.id
          };
    } catch (err) {
      throw err;
    }
  },
  /*delete post*/
    deletePost: async (args, req) => {
    try {
      const post = await Post.findById(args.postId);
      if(post == null || req.locals.user._id != post.author){
        throw new Error('Error occurred');
      }
      //update post
      var options = {isDeleted:true};
      await Post.update({_id:args.postId}, options);
      return true;
    } catch (err) {
      throw err;
    }
  },
  /*get single post*/
    singlePost: async (args, req) => {
    try {
      const result = await Post.findOne({_id:args.postId,isDeleted:false}).populate({ path: 'author', select: 'username avatar _id'}).exec();

      if(result == null){
        throw new Error("Post doesn't exists");
      }
      console.log(result);
      return{
          ...result._doc
          };
      
    } catch (err) {
      throw err;
    }
  }
  };
  