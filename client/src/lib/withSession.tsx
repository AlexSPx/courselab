import axios from "axios";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { IncomingMessage } from "http";
import { baseurl } from "./fetcher";
import { UserDataInterface } from "../interfaces";

interface SessionOptions {
  requiresAuth?: boolean | null;
  redirectTo?: string;
  requiresAdmin?: boolean;
}

declare module "http" {
  interface IncomingMessage {
    cookies: NextApiRequestCookies;
    user?: UserDataInterface;
  }
}

export function withSession<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
  {
    requiresAuth = true,
    redirectTo = "/login",
    requiresAdmin = false,
  }: SessionOptions = {}
) {
  return async function Authenticate(context: GetServerSidePropsContext) {
    const { isAuth, user } = await getAuth(context.req);

    if (requiresAuth === null) {
      context.req.user = { isAuth, user: user ? user : null };
      return handler(context);
    }

    if (!isAuth && requiresAuth) {
      return {
        redirect: {
          permanent: false,
          destination: redirectTo,
        },
        props: { user: { isAuth: false, user: null } },
      };
    }

    if (requiresAdmin) {
      if (!user?.isAdmin) {
        return {
          redirect: {
            permanent: false,
            destination: redirectTo,
          },
          props: { user: { isAuth, user } },
        };
      }
    }

    if (!requiresAuth && isAuth) {
      return {
        redirect: {
          permanent: false,
          destination: "/home",
        },
        props: { user: { isAuth, user } },
      };
    }

    if (user) context.req.user = { isAuth, user };

    return handler(context);
  };
}

async function getAuth(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) {
  const res = await axios.get<UserDataInterface>(`${baseurl}/user/auth`, {
    withCredentials: true,
    headers: {
      cookie: req.headers.cookie ? req.headers.cookie : null,
    },
  });

  return { isAuth: res.data.isAuth, user: res.data.user };
}
