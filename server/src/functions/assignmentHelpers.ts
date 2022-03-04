import { AssignmentsOnUsers, AssignmentSubmits } from "@prisma/client";

type Distribution = AssignmentsOnUsers & {
  submits: AssignmentSubmits[];
};

export const submitsDitribution = (submits: Distribution[]) => {
  let submitted: Distribution[] = [];
  let missing: Distribution[] = [];

  submits.forEach((asguser) => {
    if (!asguser.submits.length) {
      missing.push(asguser);
      return;
    }

    let hasSubmit;
    asguser.submits.forEach((submit) => {
      if (submit.dateOfRemoval) return;
      hasSubmit = submit;
    });

    if (!hasSubmit) {
      missing.push(asguser);
      return;
    }

    submitted.push(asguser);
  });

  return { missing, submitted };
};
