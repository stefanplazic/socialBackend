const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Comment {
    _id: ID!
    post: Post!
    author: User!
    creationDate: String!
    content: String!
}

type Post {
  _id: ID!
  title:String!
  filePath:String!
  creationDate:String!
  author:User!
}

type User {
  _id: ID!
  email: String
  password: String
  username:String
  avatar:String
}

input PostInput {
  title: String!
  filePath: String!
  
}

input CommentInput {
  content: String!
  postId:ID!
  
}

input UserInput {
  email: String!
  password: String!
  username: String
}

type RootQuery {
    posts: [Post!]!
    singlePost(postId:ID!):Post!
    commentsByPost(postId:ID!): [Comment!]!

}

type RootMutation {
    createPost(postInput: PostInput): Post!
    updatePost(postId: ID!,postInput:PostInput): Post!
    deletePost(postId: ID!): Boolean!

    createComment(commentInput: CommentInput):Comment!
    deleteComment(commentId: ID!): Boolean!
}


schema {
    query: RootQuery
    mutation: RootMutation
}
`);