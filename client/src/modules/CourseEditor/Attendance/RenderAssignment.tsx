import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../../lib/fetcher";
import { AssignmentSubmit, GeneralUserInformation } from "../../../interfaces";
import { useModals } from "../../../components/Modal";
import GradeAssignment from "../../../components/Modal/Menus/GradeAssignment";
import FormatDate from "../../../components/FormatDate";
import { TFunction } from "react-i18next";

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
  t,
}: {
  id: string;
  courseName: string;
  startingDate: Date | null;
  t: TFunction<"course_settings", undefined>;
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
    return (
      <Submited submit={submit} index={index} key={`submit#${index}`} t={t} />
    );
  });

  const mapMissing = missing?.map((submit, index) => {
    return (
      <tr
        key={`submit#${index}`}
        className="table-compact font-semibold text-rose-700 hover cursor-pointer"
      >
        <td>{index}</td>
        <td>
          {submit.enrollment.user.first_name} {submit.enrollment.user.last_name}
        </td>
        <td className="hidden md:table-cell">
          @{submit.enrollment.user.username}
        </td>
        <td className="hidden md:table-cell">-</td>
        <td className="hidden md:table-cell">-</td>
        <td>-</td>
      </tr>
    );
  });

  return (
    <div className="overflow-w-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>{t("user-name")}</th>
            <th className="hidden md:table-cell">{t("username")}</th>
            <th className="hidden md:table-cell">{t("submitted-on")}</th>
            <th className="hidden md:table-cell">{t("submits")}</th>
            <th>{t("attachments")}</th>
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
  t,
}: {
  submit: AttendanceInterface;
  index: number;
  t: TFunction<"course_settings", undefined>;
}) => {
  const [submitIndex, setSubmitIndex] = useState(submit.submits.length - 1);

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

  const mapAttachments = submit.submits[submitIndex].attachments.map(
    (attc, index) => {
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
    }
  );
  return (
    <tr
      key={`submit#${index}`}
      className="hover cursor-pointer font-semibold"
      onClick={handleOpen}
    >
      <td>{index}</td>
      <td>
        {submit.enrollment.user.first_name} {submit.enrollment.user.last_name}
        <br />
        {submit.submits[submitIndex].returned && t("returned")}
      </td>
      <td className="hidden md:table-cell">
        @{submit.enrollment.user.username}
      </td>
      <td className="hidden md:table-cell">
        <FormatDate date={submit.submits[submitIndex].dateOfSubmit} />
      </td>
      <td className="hidden md:table-cell">{submit._count.submits}</td>
      <td>{mapAttachments}</td>
    </tr>
  );
};

export default RenderAssignment;
