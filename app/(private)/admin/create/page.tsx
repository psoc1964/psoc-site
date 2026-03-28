import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Injector, queryGQL } from "@/lib/apollo-server";
import {
  GetCurrentUserDocument,
  type GetCurrentUserQuery,
  type GetCurrentUserQueryVariables,
} from "@/__generated__/graphql";
import { Route } from "@/constants/routes";

import CreateAlbumPageClient from "../CreateAlbumPageClient";

export const dynamic = "force-dynamic";

export default async function CreateAlbumPage() {
  const cookieStore = await cookies();

  const { user } = await queryGQL<
    GetCurrentUserQuery,
    GetCurrentUserQueryVariables
  >(GetCurrentUserDocument, undefined, cookieStore, 0);

  if (!user) {
    redirect(`${Route.Login}?redirectURL=/admin/create`);
  }

  if (user.role !== "admin") {
    redirect(Route.Home);
  }

  return (
    <Injector
      fetch={async () => ({})}
      Component={CreateAlbumPageClient}
      props={{ user }}
    />
  );
}
