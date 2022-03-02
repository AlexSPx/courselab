import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type AssignmentPageProps = {
  assignment: AssignmentInterface;
};

export const AssignmentPage: NextPage<AssignmentPageProps> = ({
  assignment,
}) => {
  return (
    <MainLayout>
      {assignment ? (
        <Page assignment={assignment} />
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
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const assignmentId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(`${baseurl}/assignment/${assignmentId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          assignment: res.data,
        },
      };
    } catch (error) {
      return { props: { user: undefined, assignment: null } };
    }
  }
);
