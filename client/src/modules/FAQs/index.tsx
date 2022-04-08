import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";

export const FAQ: NextPage = () => {
  const { t } = useTranslation("faq");

  const FAQ = ({ Q, A }: { Q: string; A: string }) => {
    return (
      <li className="w-2/5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{Q}</h3>
        <p className="mt-2"></p>
        <p className="text-base leading-6 text-gray-500">{A}</p>
        <p />
      </li>
    );
  };
  return (
    <section className="container mx-auto p-8">
      <SeoTags
        title="CourseLab | Frequently Asked Questions"
        description="An online learning platform for students to access course-specific study resources. And instructors, teachers or anyone to create courses."
        keywords="courselab, course lab, course-lab, course-lab xyz, course, free courses, create course, create courses, enroll, enroll in courses, build your course, course builder, quiz builder, 
        assignment, assignments, quiz, quizzes, students, teachers, structure, structure course"
      />
      <h2 className="text-3xl font-extrabold leading-9 border-b-2 border-gray-100 text-gray-900 mb-12">
        {t("title")}
      </h2>
      <ul className="flex items-start gap-8 flex-wrap">
        <FAQ Q={t("q1")} A={t("a1")} />
        <FAQ Q={t("q2")} A={t("a2")} />
        <FAQ Q={t("q3")} A={t("a3")} />
        <FAQ Q={t("q4")} A={t("a4")} />
        <FAQ Q={t("q5")} A={t("a5")} />
        <FAQ Q={t("q6")} A={t("a6")} />
        <FAQ Q={t("q7")} A={t("a7")} />
      </ul>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    return {
      props: {
        user: req.user || null,
        ...(await serverSideTranslations(locale!, ["common", "faq"])),
      },
    };
  },
  {
    requiresAuth: null,
  }
);
