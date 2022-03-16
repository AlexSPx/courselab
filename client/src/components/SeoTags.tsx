import React from "react";
import Head from "next/head";

export default function SeoTags({
  title,
  description,
  keywords,
}: {
  title: string;
  description: string;
  keywords?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      {keywords && <meta name="keywords" content={keywords}></meta>}
    </Head>
  );
}
