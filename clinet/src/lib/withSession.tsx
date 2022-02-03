import axios from "axios";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { IncomingMessage } from "http";
import { baseurl } from "./fetcher";
import { UserDataInterface } from "../interfaces";

interface SessionOptions {
  requiresAuth?: boolean;
  redirectTo?: string;
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
  { requiresAuth = true, redirectTo = "/login" }: SessionOptions = {}
) {
  return async function Authenticate(context: GetServerSidePropsContext) {
    const { isAuth, user } = await getAuth(context.req);

    if (!isAuth && requiresAuth) {
      return {
        redirect: {
          permanent: false,
          destination: redirectTo,
        },
        props: { user: null },
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
