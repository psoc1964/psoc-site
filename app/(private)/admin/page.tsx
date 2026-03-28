import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Injector, queryGQL } from "@/lib/apollo-server";
import {
  GetCurrentUserDocument,
  type GetCurrentUserQuery,
  type GetCurrentUserQueryVariables,
  GetAdminAlbumsDocument,
  type GetAdminAlbumsQuery,
  type GetAdminAlbumsQueryVariables,
} from "@/__generated__/graphql";
import { Route } from "@/constants/routes";

import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  const cookieStore = await cookies();

  const { user } = await queryGQL<
    GetCurrentUserQuery,
    GetCurrentUserQueryVariables
  >(GetCurrentUserDocument, undefined, cookieStore, 0);

  if (!user) {
    redirect(`${Route.Login}?redirectURL=/admin`);
  }

  if (user.role !== "admin") {
    redirect(Route.Home);
  }

  return (
    <Injector
      fetch={() =>
        queryGQL<GetAdminAlbumsQuery, GetAdminAlbumsQueryVariables>(
          GetAdminAlbumsDocument,
          undefined,
          cookieStore,
          0,
        )
      }
      Component={AdminPageClient}
      props={{ user }}
    />
  );
}
