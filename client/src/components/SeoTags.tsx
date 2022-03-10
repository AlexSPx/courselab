import React from "react";
import Head from "next/head";

export default function SeoTags({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
    </Head>
  );
}
