import { gql } from "@/__generated__";

export const GET_CURRENT_USER = gql(`
  #graphql
  query GetCurrentUser {
    user: getCurrentUser {
      id
      email
      name
      emailVerified
      role
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
    getPublishedAlbums {
      id
      name
      albumUrl
      thumbnailUrl
      createdAt
    }
  }
`);

export const GET_FEATURED_ALBUMS = gql(`
  #graphql
  query GetFeaturedAlbums {
    getFeaturedAlbums {
      id
      name
      albumUrl
      thumbnailUrl
      createdAt
      featuredAlbum
    }
  }
`);

export const GET_UNPUBLISHED_ALBUMS = gql(`
  #graphql
  query GetUnpublishedAlbums {
    albums: getUnpublishedAlbums {
      id
      name
      albumUrl
      thumbnailUrl
      createdAt
    }
  }
`);

export const GET_ADMIN_ALBUMS = gql(`
  #graphql
  query GetAdminAlbums {
    published: getPublishedAlbums {
      id
      name
      albumUrl
      thumbnailUrl
      isPublished
      featuredAlbum
      createdAt
    }
    unpublished: getUnpublishedAlbums {
      id
      name
      albumUrl
      thumbnailUrl
      isPublished
      featuredAlbum
      createdAt
    }
  }
`);
