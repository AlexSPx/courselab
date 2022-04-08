import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";
import { MessagesLayout } from "./MessagesLayout";

export const ChatMessages: NextPage = () => {
  return (
    <MessagesLayout>
      <SeoTags
        title={`Chat Messages`}
        description={`The place to chat with your course teachers or just anyone`}
      />
    </MessagesLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    return {
      props: {
        user: req.user,
        ...(await serverSideTranslations(locale!, ["common"])),
      },
    };
  }
);
