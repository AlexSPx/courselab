import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../../lib/fetcher";
import { AssignmentSubmit, GeneralUserInformation } from "../../../interfaces";
import formatDate from "../../../lib/dateFormater";
import { useModals } from "../../../components/Modal";
import GradeAssignment from "../../../components/Modal/Menus/GradeAssignment";

export interface AttendanceInterface {
  assignment_id: string;
  enrollment_id: string;
  enrollment: {
    user: GeneralUserInformation;
  };
  submits: AssignmentSubmit[];
  _count: {
    submits: number;
  };
}

interface Missing {
  assignment_id: string;
  enrollment_id: string;
  enrollment: {
    user: GeneralUserInformation;
  };
}

const RenderAssignment = ({
  id,
  courseName,
  startingDate,
}: {
  id: string;
  courseName: string;
  startingDate: Date;
}) => {
  const [submitted, setSubmitted] = useState<AttendanceInterface[]>();
  const [missing, setMissing] = useState<Missing[]>();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post(
        `${baseurl}/assignment/submits/details`,
        { assignmentId: id, course: courseName, startingDate },
        { withCredentials: true }
      );

      setSubmitted(res.data.submitted);
      setMissing(res.data.missing);
    };
    fetch();
  }, [courseName, id, startingDate]);

  const mapSubmitted = submitted?.map((submit, index) => {
    return <Submited submit={submit} index={index} key={`submit#${index}`} />;
  });

  const mapMissing = missing?.map((submit, index) => {
    return (
      <tr
        key={`submit#${index}`}
        className="table-compact text-rose-700 hover cursor-pointer"
      >
        <th>{index}</th>
        <th>
          {submit.enrollment.user.first_name} {submit.enrollment.user.last_name}
        </th>
        <th className="hidden md:table-cell">
          @{submit.enrollment.user.username}
        </th>
        <th className="hidden md:table-cell">-</th>
        <th className="hidden md:table-cell">-</th>
        <th>-</th>
      </tr>
    );
  });

  return (
    <div className="overflow-w-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th className="hidden md:table-cell">Username</th>
            <th className="hidden md:table-cell">Submitted At</th>
            <th className="hidden md:table-cell">Submits</th>
            <th>Attachments</th>
          </tr>
        </thead>
        <tbody>{mapSubmitted}</tbody>
        <tbody>{mapMissing}</tbody>
      </table>
    </div>
  );
};

const Submited = ({
  submit,
  index,
}: {
  submit: AttendanceInterface;
  index: number;
}) => {
  const { pushModal, closeModal } = useModals();

  const handleOpen = () => {
    const akey = `greade#${new Date()}`;
    pushModal(
      <GradeAssignment
        onClose={() => closeModal(akey)}
        key={akey}
        submit={submit}
      />,
      {
        timer: false,
      }
    );
  };

  const mapAttachments = submit.submits[0].attachments.map((attc, index) => {
    if (attc.type === "FILE")
      return (
        <p
          key={`attc#${index}`}
          className="truncate hover:text-ellipsis max-w-[10rem]"
        >
          {attc.path!.split("{-divide-}")[2]}
        </p>
      );
    return <p key={`attc#${index}`}>{attc.type}</p>;
  });
  return (
    <tr
      key={`submit#${index}`}
      className="hover cursor-pointer"
      onClick={handleOpen}
    >
      <th>{index}</th>
      <th>
        {submit.enrollment.user.first_name} {submit.enrollment.user.last_name}
      </th>
      <th className="hidden md:table-cell">
        @{submit.enrollment.user.username}
      </th>
      <th className="hidden md:table-cell">
        {formatDate(submit.submits[0].dateOfSubmit)}
      </th>
      <th className="hidden md:table-cell">{submit._count.submits}</th>
      <th>{mapAttachments}</th>
    </tr>
  );
};

export default RenderAssignment;
