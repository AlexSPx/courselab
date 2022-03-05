import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { DocumentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { MainLayout } from "../Layouts/MainLayout";
import dynamic from "next/dynamic";
import { withSession } from "../../lib/withSession";
import Error401 from "../../components/Error401";

const Page = dynamic(() => import("./Page"), { ssr: false });

type DocumentPageProps = {
  document: DocumentInterface;
};

export const Document: NextPage<DocumentPageProps> = ({ document }) => {
  return (
    <MainLayout css="sm:h-full">
      {document ? <Page doc={document} /> : <Error401 />}
    </MainLayout>
  );
};
export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req }) => {
    const docId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(`${baseurl}/doc/${docId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      console.log(res.data);

      return {
        props: {
          user: req.user,
          document: res.data,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        props: {
          user: undefined,
          document: null,
        },
      };
    }
  }
);
