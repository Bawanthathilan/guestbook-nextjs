"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const { data: session } = useSession<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>("");
  const [userMsg, setUserMsg] = useState<any>([]);

  const SUPABASE_URL = "<supabase url>";
  const SUPABASE_ANON_KEY = "<supabase anon key>";

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const getGuestBookData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guestbook")
        .select()
        .order("created_at", { ascending: false });

      setMessage(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGuestBookData();
  }, []);

  const handleInput = (e: any) => {
    setUserMsg(e.target.value);
  };

  const createMessage = async (e: any) => {
    e.preventDefault();
    try {
      const { data, error }: any = await supabase.from("guestbook").insert([
        {
          message: userMsg,
          user_id: session?.user?.id,
          username: session?.user?.name,
        },
      ]);
      setUserMsg("");
      getGuestBookData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" container mx-auto max-w-5xl mt-10">
      <h1 className=" text-lg">Guestbook Feature</h1>

      {session && (
        <>
          <div className="flex flex-col gap-5">
            <h4 className="text-lg">sign in as {session?.user?.name}</h4>
            <div>
              <form onSubmit={createMessage} className="flex flex-row gap-3">
                <input
                  type="text"
                  value={userMsg}
                  onChange={handleInput}
                  className="border-2 p-2 rounded-md w-full"
                  placeholder="Enter Your Message"
                />
                <button
                  type="submit"
                  className=" bg-black px-5 rounded-md text-white w-[250px]"
                >
                  Submit
                </button>
              </form>
            </div>

            <button
              onClick={() => signOut()}
              className="bg-primary text-white flex flex-row gap-3 items-center p-3 rounded-md w-[250px] justify-center"
            >
              Sign out
            </button>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {loading && <h1>Loading ..</h1>}
            {message &&
              message.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-row gap-5 bg-secondary p-5 rounded-xl justify-between mt-5"
                >
                  <div className="left flex flex-row gap-5">
                    <p style={{ color: "#525252" }}>{item.username} : </p>
                    <p style={{ color: "#525252" }}>{item.message}</p>
                  </div>

                  <p style={{ color: "#525252" }}>{item.created_at}</p>
                </div>
              ))}
          </div>
        </>
      )}

      {!session && (
        <button
          onClick={() => signIn("github")}
          className=" bg-gray-900 flex flex-row justify-center gap-5 rounded-xl text-white px-5 py-3"
        >
          Sign in with Github
        </button>
      )}
    </div>
  );
}
