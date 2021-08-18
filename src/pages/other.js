import React from "react";
import Link from "next/link";
import Meta from "./../components/Meta";

function OtherPage(props) {
  return (
    <>
      <Meta Title="Other" />
      Just testing that routing works. Go back to{" "}
      <Link href="/">
        <a>home</a>
      </Link>
      .
    </>
  );
}

export default OtherPage;
