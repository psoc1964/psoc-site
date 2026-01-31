import { gql } from "@/__generated__";

export const GET_CURRENT_USER = gql(`
  #graphql
  query GetCurrentUser {
    user: getCurrentUser {
      id
      email
      name
      emailVerified
    }
  }
`);

export const VERIFY_EMAIL = gql(`
  #graphql
  query VerifyEmail($token:String!) {
    verifyEmail(token: $token)
  }
`);

export const GET_PUBLISHED_ALBUMS = gql(`
  #graphql
  query GetPublishedAlbums {
    albums: getPublishedAlbums {
      id
      name
      url
      createdAt
    }
  }
`);

export const GET_UNPUBLISHED_ALBUMS = gql(`
  #graphql
  query GetUnpublishedAlbums {
    albums: getUnpublishedAlbums {
      id
      name
      url
      createdAt
    }
  }
`); 
