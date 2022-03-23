import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import SeoTags from "../../components/SeoTags";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type AssigmentEditorTypes = {
  assignment: AssignmentInterface;
};

export const AssignmentEditor: NextPage<AssigmentEditorTypes> = ({
  assignment,
}) => {
  return (
    <MainLayout css="overflow-auto">
      <SeoTags
        title={`CourseLab | Assignment edtior - ${assignment.name || "Error"}`}
        description={"Assignment editor"}
      />
      <Page assignment={assignment} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const assignmentId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(
        `${baseurl}/assignment/admin/${assignmentId}`,
        {
          withCredentials: true,
          headers: {
            cookie: req?.headers.cookie,
          },
        }
      );

      return { props: { user: req.user, assignment: res.data } };
    } catch (error) {
      return { props: { user: undefined, assignment: null } };
    }
  }
);
