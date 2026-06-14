"use client";
import React from "react";

import useHandleAuthorized from "@/app/(public)/components/auth/handle-authorized";
import { Route } from "@/constants/routes";

import AuthLayout from "../components/auth/auth-layout";

export default function LoginForm({
  data: paramsRedirectURL,
}: {
  data?: string;
}) {
  useHandleAuthorized();
  const redirectURL = paramsRedirectURL || Route.Home;

  return (
    <AuthLayout
      redirectURL={redirectURL}
      title="Login to your account"
    />
  );
}