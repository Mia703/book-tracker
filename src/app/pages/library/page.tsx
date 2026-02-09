"use client";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import MainHeader from "@/app/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Accordion } from "@radix-ui/react-accordion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Library() {
  const [loggedin, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      }
    | undefined
  >();

  const router = useRouter();

  useEffect(() => {
    const userData = window.sessionStorage.getItem("user");
    if (userData) {
      const user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      } = JSON.parse(userData);

      if (user.email != "") {
        setLoggedIn(true);
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(undefined);
      }
    }
  }, []);

  // CREATES A BLANK BOOK PLACEHOLDER TILL DATA LOADS
  const placeholder = [];
  for (let i = 0; i < 15; i++) {
    placeholder.push(
      <div
        className="loading-book flex w-fit flex-col items-center justify-center"
        key={i}
      >
        <div className="blank-book h-45 w-32 bg-gray-400"></div>
        <hr className="my-2 w-25 border-2 border-gray-600" />
        <hr className="w-20 border-2 border-gray-600" />
      </div>,
    );
  }

  return (
    <MainGrid>
      {loggedin ? (
        <section
          id="library"
          className="col-span-4 md:col-span-6 lg:col-span-12"
        >
          <MainHeader user={user} />

          <Accordion type="single" collapsible defaultValue="accordion-item-1">
            <Dropdown name="Wish List" index={0}>
              <div
                className="loading-wrapper horizontal-media-scroller"
                style={{ overflow: "hidden" }}
              >
                {placeholder}
              </div>
            </Dropdown>

            <Dropdown name="Reading" index={1}>
              <div
                className="loading-wrapper horizontal-media-scroller"
                style={{ overflow: "hidden" }}
              >
                {placeholder}
              </div>
            </Dropdown>

            <Dropdown name="Finished" index={2}>
              <div
                className="loading-wrapper horizontal-media-scroller"
                style={{ overflow: "hidden" }}
              >
                {placeholder}
              </div>
            </Dropdown>

            <Dropdown name="DNF" index={3}>
              <div
                className="loading-wrapper horizontal-media-scroller"
                style={{ overflow: "hidden" }}
              >
                {placeholder}
              </div>
            </Dropdown>
          </Accordion>
        </section>
      ) : (
        <section
          id="logged-out"
          className="col-span-4 flex h-[60vh] flex-col items-center justify-center md:col-span-6 lg:col-span-12"
        >
          <h1 className="mb-2 text-2xl font-bold">
            You&apos;re not logged in!
          </h1>
          <Button
            className="pink cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Back to Login
          </Button>
        </section>
      )}
    </MainGrid>
  );
}
