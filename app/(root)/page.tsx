import { currentUser } from "@clerk/nextjs/server";
import React from "react"
import { redirect } from "next/navigation";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  return (
    <>
      <h1>hey this is the home page</h1>
    </>
  )
}

export default Home
