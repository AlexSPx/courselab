import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";
import Landing from "../../svg/Landing";
import { TFunction } from "react-i18next";
import LazyImage from "../../components/LazyImage";

export const LandingPage: NextPage = () => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <main className="container mx-auto px-2 justify-center items-center mb-16">
      <SeoTags
        title="CourseLab | enroll in or create online courses |"
        description="An online learning platform for students to access course-specific study resources. And instructors, teachers or anyone to create courses."
        keywords="courselab, course lab, course-lab, course-lab xyz, course, free courses, create course, create courses, enroll, enroll in courses, build your course, course builder, quiz builder, 
        assignment, assignments, quiz, quizzes, students, teachers, structure, structure course, noit, edusoft, fmi, sofia uni"
      />
      <section>
        <div className="flex flex-col-reverse md:flex-row items-center h-1/2 w-full font-thin">
          <div className="flex flex-col w-2/3 md:w-1/2 justify-center text-left">
            <h1 className="text-3xl md:text-5xl font-semibold">
              {t("h1")} <strong>{t("title", { ns: "common" })}</strong>
            </h1>
            <h2 className="text-xl font-normal">{t("subheader")}</h2>
            <Link href="/register">
              <a className="btn btn-outline w-44 mt-6">{t("get-started")}</a>
            </Link>
          </div>
          <div className="flex w-full md:w-1/2 h-full justify-center">
            <div className="flex w-3/5 md:w-full justify-center">
              <Landing />
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection t={t} />
      <Support t={t} />
      <CourseFeatureBig
        subtitle={t("course-structure")}
        title={t("course-structure-title")}
        imagePath="/course-stucture.png"
      >
        {t("course-structure-body")}
      </CourseFeatureBig>
      <CourseFeatureBig
        subtitle={t("course-landing")}
        title={t("course-landing-title")}
        imagePath="/course-landing.png"
      >
        {t("course-landing-body")}
      </CourseFeatureBig>
      <CourseFeatureBig
        subtitle={t("course-attendance")}
        title={t("course-attendance-title")}
        imagePath="/course-attendance.png"
      >
        {t("course-attendance-body")}
      </CourseFeatureBig>
      <Footer t={t} />
    </main>
  );
};

const FeaturesSection = ({
  t,
}: {
  t: TFunction<("landing" | "common")[], undefined>;
}) => {
  return (
    <section className="items-center w-full">
      <div className="mb-16 text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
          {t("features")}
        </h2>
        <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {t("what-it-offers")}
        </h3>
      </div>
      <div className="flex flex-wrap my-12 dark:text-white justify-center">
        <Feature title={t("shared-docs")}>{t("shared-docs-desc")}</Feature>
        <Feature title={t("video-player")}>{t("video-player-desc")}</Feature>
        <Feature title={t("quiz-builder")} border="l">
          {t("quiz-builder-desc")}
        </Feature>
        <Feature title={t("assignments")}>{t("assignments-desc")}</Feature>
        <Feature title={t("text-chat")} border="l">
          {t("text-chat-desc")}
        </Feature>
      </div>
    </section>
  );
};

const Feature: React.FC<{ title: string; border?: "r" | "l" }> = ({
  title,
  children,
  border = "r",
}) => {
  return (
    <div
      className={`w-full border-b md:w-1/2 md:border-${border} lg:w-1/3 p-8`}
    >
      <div className="flex items-center mb-6">
        <svg
          width={20}
          height={20}
          fill="currentColor"
          className="h-6 w-6 text-indigo-500"
          viewBox="0 0 1792 1792"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z"></path>
        </svg>
        <h3 className="ml-4 text-xl">{title}</h3>
      </div>
      <p className="leading-loose text-gray-500 dark:text-gray-200 text-md">
        {children}
      </p>
    </div>
  );
};

const Support = ({
  t,
}: {
  t: TFunction<("landing" | "common")[], undefined>;
}) => {
  const Element = ({ text }: { text: string }) => {
    return (
      <li className="mt-6 lg:mt-0">
        <div className="flex">
          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <h5 className="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
            {text}
          </h5>
        </div>
      </li>
    );
  };

  return (
    <section className="flex justify-center w-full mt-28">
      <div className="flex flex-col max-w-xl">
        <div>
          <h3 className="text-base leading-6 text-indigo-500 font-semibold uppercase">
            {t("transparency")}
          </h3>
          <h4 className="mt-2 text-2xl leading-8 font-extrabold text-gray-900 dark:text-white sm:text-3xl sm:leading-9">
            {t("transparency-sub")}
          </h4>
          <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-300">
            {t("transparency-body")}
          </p>
        </div>

        <ul className="mt-8 md:grid md:grid-cols-2 gap-6">
          <Element text={t("transparency-el1")} />
          <Element text={t("transparency-el2")} />
          <Element text={t("transparency-el3")} />
        </ul>
      </div>
    </section>
  );
};

const CourseFeatureBig: React.FC<{
  subtitle: string;
  title: string;
  imagePath: string;
}> = ({ subtitle, title, imagePath, children }) => {
  return (
    <section className="grid relative overflow-hidden grid-cols-1 grid-rows-2 md:grid-cols-3 md:grid-rows-2 gap-3.5 mt-24">
      <div className="row-start-auto row-end-auto md:row-span-2 z-10">
        <h3 className="text-base leading-6 text-indigo-500 font-semibold uppercase">
          {subtitle}
        </h3>
        <h4 className="mt-2 text-2xl leading-8 font-extrabold text-gray-900 dark:text-white sm:text-3xl sm:leading-9">
          {title}
        </h4>
        <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-300">
          {children}
        </p>
      </div>
      <div className="row-start-2 col-start-1 md:row-span-2 md:col-start-2 md:col-span-3 border">
        <div className="relative h-[18.4rem] md:h-[30rem]">
          <LazyImage src={imagePath} alt="course structure image" />
        </div>
      </div>
    </section>
  );
};

const Footer = ({
  t,
}: {
  t: TFunction<("landing" | "common")[], undefined>;
}) => {
  return (
    <footer className="py-8">
      <div className="text-center text-gray-500 dark:text-gray-200 pt-10 sm:pt-12 font-light flex items-center justify-center">
        {t("created-by")}
      </div>
    </footer>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    return {
      props: {
        user: req.user || null,
        ...(await serverSideTranslations(locale!, ["landing", "common"])),
      },
    };
  },
  {
    requiresAuth: false,
  }
);
