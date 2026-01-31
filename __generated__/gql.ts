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
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n    }\n  }\n": typeof types.GetCurrentUserDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": typeof types.VerifyEmailDocument,
    "\n  #graphql\n  query GetPublishedAlbums {\n    albums: getPublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n": typeof types.GetPublishedAlbumsDocument,
    "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n": typeof types.GetUnpublishedAlbumsDocument,
};
const documents: Documents = {
    "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n": types.ResetPasswordDocument,
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": types.VerifyEmailDocument,
    "\n  #graphql\n  query GetPublishedAlbums {\n    albums: getPublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n": types.GetPublishedAlbumsDocument,
    "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n": types.GetUnpublishedAlbumsDocument,
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
export function gql(source: "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      name\n      emailVerified\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetPublishedAlbums {\n    albums: getPublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetPublishedAlbums {\n    albums: getPublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetUnpublishedAlbums {\n    albums: getUnpublishedAlbums {\n      id\n      name\n      url\n      createdAt\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;