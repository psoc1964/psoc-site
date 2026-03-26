import { gql } from "@/__generated__";

// export const SEND_RESET_PASSWORD_EMAIL = gql(`
//   #graphql
//   mutation SendResetPasswordEmail($email:String!) {
//     sendResetPasswordEmail(email: $email)
//   }
// `);

// export const SEND_VERIFICATION_EMAIL = gql(`
//   #graphql
//   mutation SendVerificationEmail {
//     sendVerificationEmail
//   }
// `);

export const RESET_PASSWORD = gql(`
  #graphql
  mutation ResetPassword($newPassword:String!, $token:String!) {
    resetPassword(newPassword: $newPassword, token:$token)  
  }
`);

export const CREATE_ALBUM = gql(`
  #graphql
  mutation CreateAlbum(
    $name: String!
    $albumUrl: String
    $thumbnailUrl: String
    $isPublished: Boolean
    $featuredAlbum: Boolean
  ) {
    createAlbum(
      name: $name
      albumUrl: $albumUrl
      thumbnailUrl: $thumbnailUrl
      isPublished: $isPublished
      featuredAlbum: $featuredAlbum
    ) {
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

export const UPDATE_ALBUM = gql(`
  #graphql
  mutation UpdateAlbum(
    $id: Float!
    $name: String
    $albumUrl: String
    $thumbnailUrl: String
    $isPublished: Boolean
    $featuredAlbum: Boolean
  ) {
    updateAlbum(
      id: $id
      name: $name
      albumUrl: $albumUrl
      thumbnailUrl: $thumbnailUrl
      isPublished: $isPublished
      featuredAlbum: $featuredAlbum
    ) {
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
