import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";
import SkeletonLoading from "./SkeletonLoading";

export default function index() {
  return (
    <WithAuth loading={<SkeletonLoading />}>
      <AuthHeader />
      <MainLayout>
        <Page />
      </MainLayout>
    </WithAuth>
  );
}
