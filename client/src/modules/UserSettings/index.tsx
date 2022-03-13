import { NextPage, GetServerSideProps } from "next";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

export const UserSettingsPage: NextPage = () => {
  return (
    <MainLayout css="overflow-auto bg-gray-50">
      {/* <SeoTags
          title={`CourseLab | Quiz page - ${quiz?.name || "Error"}`}
          description="Quiz page"
        /> */}
      <Page />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    return {
      props: {
        user: req.user || null,
      },
    };
  },
  {
    requiresAuth: true,
  }
);
