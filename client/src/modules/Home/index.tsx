import { GetServerSideProps, NextPage } from "next";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

export const Home: NextPage = () => {
  return (
    <MainLayout>
      <Page />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req }) => {
    try {
      return {
        props: {
          user: req.user,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
        },
      };
    }
  }
);
