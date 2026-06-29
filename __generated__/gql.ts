/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n": typeof types.ResetPasswordDocument,
    "\n  #graphql\n  mutation CreateAlbum(\n    $name: String!\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n    $sendEmail: String\n  ) {\n    createAlbum(\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n      sendEmail: $sendEmail\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": typeof types.CreateAlbumDocument,
    "\n  #graphql\n  mutation UpdateAlbum(\n    $id: Float!\n    $name: String\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n  ) {\n    updateAlbum(\n      id: $id\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": typeof types.UpdateAlbumDocument,
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n      role\n    }\n  }\n": typeof types.GetCurrentUserDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": typeof types.VerifyEmailDocument,
    "\n  #graphql\n  query GetPublishedAlbums {\n    getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      isauthentic\n    }\n  }\n": typeof types.GetPublishedAlbumsDocument,
    "\n  #graphql\n  query GetFeaturedAlbums {\n    getFeaturedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      featuredAlbum\n      isauthentic\n    }\n  }\n": typeof types.GetFeaturedAlbumsDocument,
    "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n    }\n  }\n": typeof types.GetUnpublishedAlbumsDocument,
    "\n  #graphql\n  query GetAdminAlbums {\n    published: getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n    unpublished: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": typeof types.GetAdminAlbumsDocument,
};
const documents: Documents = {
    "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n": types.ResetPasswordDocument,
    "\n  #graphql\n  mutation CreateAlbum(\n    $name: String!\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n    $sendEmail: String\n  ) {\n    createAlbum(\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n      sendEmail: $sendEmail\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": types.CreateAlbumDocument,
    "\n  #graphql\n  mutation UpdateAlbum(\n    $id: Float!\n    $name: String\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n  ) {\n    updateAlbum(\n      id: $id\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": types.UpdateAlbumDocument,
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n      role\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": types.VerifyEmailDocument,
    "\n  #graphql\n  query GetPublishedAlbums {\n    getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      isauthentic\n    }\n  }\n": types.GetPublishedAlbumsDocument,
    "\n  #graphql\n  query GetFeaturedAlbums {\n    getFeaturedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      featuredAlbum\n      isauthentic\n    }\n  }\n": types.GetFeaturedAlbumsDocument,
    "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n    }\n  }\n": types.GetUnpublishedAlbumsDocument,
    "\n  #graphql\n  query GetAdminAlbums {\n    published: getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n    unpublished: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n": types.GetAdminAlbumsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n"): (typeof documents)["\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation CreateAlbum(\n    $name: String!\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n    $sendEmail: String\n  ) {\n    createAlbum(\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n      sendEmail: $sendEmail\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation CreateAlbum(\n    $name: String!\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n    $sendEmail: String\n  ) {\n    createAlbum(\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n      sendEmail: $sendEmail\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation UpdateAlbum(\n    $id: Float!\n    $name: String\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n  ) {\n    updateAlbum(\n      id: $id\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UpdateAlbum(\n    $id: Float!\n    $name: String\n    $albumUrl: String\n    $thumbnailUrl: String\n    $isPublished: Boolean\n    $featuredAlbum: Boolean\n    $isauthentic: Boolean\n  ) {\n    updateAlbum(\n      id: $id\n      name: $name\n      albumUrl: $albumUrl\n      thumbnailUrl: $thumbnailUrl\n      isPublished: $isPublished\n      featuredAlbum: $featuredAlbum\n      isauthentic: $isauthentic\n    ) {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n      role\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetPublishedAlbums {\n    getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      isauthentic\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetPublishedAlbums {\n    getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      isauthentic\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetFeaturedAlbums {\n    getFeaturedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      featuredAlbum\n      isauthentic\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetFeaturedAlbums {\n    getFeaturedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n      featuredAlbum\n      isauthentic\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetAdminAlbums {\n    published: getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n    unpublished: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetAdminAlbums {\n    published: getPublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n    unpublished: getUnpublishedAlbums {\n      id\n      name\n      albumUrl\n      thumbnailUrl\n      isPublished\n      featuredAlbum\n      isauthentic\n      createdAt\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;