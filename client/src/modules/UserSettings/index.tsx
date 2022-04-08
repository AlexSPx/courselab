import { NextPage, GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

export const UserSettingsPage: NextPage = () => {
  return (
    <MainLayout css="overflow-auto bg-gray-50">
      <SeoTags
        title={`CourseLab | User Settings`}
        description="User settings page"
      />
      <Page />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    return {
      props: {
        user: req.user || null,
        ...(await serverSideTranslations(locale!, ["common"])),
      },
    };
  },
  {
    requiresAuth: true,
  }
);
