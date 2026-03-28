import { Injector, queryGQL } from "@/lib/apollo-server";
import AlbumPageClient from "./AlbumPageClient";
import {
  GetPublishedAlbumsDocument,
  type GetPublishedAlbumsQuery,
  type GetPublishedAlbumsQueryVariables,
} from "@/__generated__/graphql";

export const dynamic = "force-dynamic";

// Server component: fetches albums on the server using Apollo
// and streams them into the client wrapper via Injector.

export default function AlbumPage() {
  return (
    <Injector
      fetch={() =>
        queryGQL<GetPublishedAlbumsQuery, GetPublishedAlbumsQueryVariables>(
          GetPublishedAlbumsDocument,
        )
      }
      Component={AlbumPageClient}
    />
  );
}
