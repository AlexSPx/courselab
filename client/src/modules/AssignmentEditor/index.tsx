import axios from "axios";
import { NextPage } from "next";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type AssigmentEditorTypes = {
  assignment: AssignmentInterface;
};

export const AssignmentEditor: NextPage<AssigmentEditorTypes> = ({
  assignment,
}) => {
  console.log(assignment);

  return (
    <WithAuth>
      <AuthHeader />
      <MainLayout>
        <Page assignment={assignment} />
      </MainLayout>
    </WithAuth>
  );
};

AssignmentEditor.getInitialProps = async ({ req, query }) => {
  const assignmentId = typeof query.id === "string" ? query.id : "";

  try {
    const res = await axios.get(`${baseurl}/assignment/admin/${assignmentId}`, {
      withCredentials: true,
      headers: {
        cookie: req?.headers.cookie,
      },
    });

    return { assignment: res.data };
  } catch (error) {
    console.log(error);

    return { assignment: null };
  }
};
