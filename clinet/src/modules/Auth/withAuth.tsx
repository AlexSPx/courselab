import { useRouter } from "next/dist/client/router";
import useUser from "./useUser";

interface WithAuthProps {
  loading?: JSX.Element;
  requiresAuth?: boolean;
}

export const WithAuth: React.FC<WithAuthProps> = ({
  children,
  requiresAuth = true,
  loading = null,
}) => {
  const { push } = useRouter();

  const { data, isLoading } = useUser();

  if (isLoading) {
    return loading ? <>{loading}</> : <div className="flex">Loading...</div>;
  }

  if (!data?.isAuth && requiresAuth) {
    push("/login");
    return null;
  }

  if (data?.isAuth && !requiresAuth) {
    push("/home");
    return null;
  }

  return <>{children}</>;
};
