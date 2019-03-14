import { gql } from 'apollo-boost'

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      user {
        id
        email
        name
      }
      token
    }
  }
`

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

const login = gql`
  mutation($data: UserLoginInput!) {
    loginUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`

const getPosts = gql`
    query {
      posts {
        published 
     }
    }
  `

const getMyPosts = gql`
    query {
      myPosts {
        id
        published
      }
    }
  `

const updatePost = gql`
    mutation($data: UpdatePostInput!, $id: ID!) {
      updatePost(
        id: $id
        data: $data
      ) {
        id
        published
      }
    }
  `

const createPost = gql`
    mutation($data: CreatePostInput!) {
      createPost(data: $data) {
        id
        published
        title
        body
      }
    }
  `

const deletePost = gql`
    mutation($id: ID!) {
      deletePost(id: $id) {
        id
      }
    }
  `
const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      text
    }
  }
`

export {
  getProfile,
  login,
  getUsers,
  createUser,
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
  deleteComment,
}
