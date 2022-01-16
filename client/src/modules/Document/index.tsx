import axios from "axios";
import { NextPage } from "next";
import { DocumentInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import { MainLayout } from "../Layouts/MainLayout";
import dynamic from "next/dynamic";
import useSWR from "swr";

const Page = dynamic(() => import("./Page"), { ssr: false });

type DocumentPageProps = {
  document: DocumentInterface;
};

export const Document: NextPage<DocumentPageProps> = ({ document }) => {
  // const { data } = useSWR(`${baseurl}/doc/${document?.id}`, fetcher, {
  //   fallback: document || {},
  // });

  return (
    <WithAuth>
      <AuthHeader />
      <MainLayout css="overflow-auto">
        {document ? (
          <Page doc={document} />
        ) : (
          <div className="flex w-full h-full items-center justify-center">
            <p className="font-semibold text-2xl uppercase">
              <p className="text-center text-8xl">401</p>
              {`Either the document does not exist or`}
              <br />
              {` you don't have
              permissions to access it`}
            </p>
          </div>
        )}
      </MainLayout>
    </WithAuth>
  );
};

Document.getInitialProps = async ({ query, req }) => {
  const docId = typeof query.id === "string" ? query.id : "";

  try {
    const res = await axios.get(`${baseurl}/doc/${docId}`, {
      withCredentials: true,
      headers: {
        cookie: req?.headers.cookie,
      },
    });

    return {
      document: res.data,
    };
  } catch (error) {
    console.log(error);

    return { document: null };
  }
};
