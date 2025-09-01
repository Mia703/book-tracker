"use client";
import Book from "@/app/components/Book";
import BookInfo from "@/app/components/BookInfo";
import BookScreen from "@/app/components/BookScreen";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { Book as BookType, LibraryList } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Accordion } from "@radix-ui/react-accordion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGoogleBooks__ByReadingProgress } from "../utils/utils";

export default function Library() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [cache, setCache] = useState<LibraryList>({
    wishlist: [],
    reading: [],
    finished: [],
    dnf: [],
  });

  const router = useRouter();

  useEffect(() => {
    const userData = window.sessionStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setLoggedIn(true);

      async function getAllBooks(userEmail: string, batchSize: number) {
        // Option 1
        const wishList = await fetchGoogleBooks__ByReadingProgress(
          "wishlist",
          userEmail,
          batchSize,
        );
        const readingList = await fetchGoogleBooks__ByReadingProgress(
          "reading",
          userEmail,
          batchSize,
        );
        const finishedList = await fetchGoogleBooks__ByReadingProgress(
          "finished",
          userEmail,
          batchSize,
        );
        const dnfList = await fetchGoogleBooks__ByReadingProgress(
          "dnf",
          userEmail,
          batchSize,
        );

        // Option 2
        // const [wishList, readingList, finishedList, dnfList] =
        //   await Promise.all([
        //     fetchGoogleBooks__ByReadingProgress(
        //       "wishlist",
        //       userEmail,
        //       batchSize,
        //     ),
        //     fetchGoogleBooks__ByReadingProgress(
        //       "reading",
        //       userEmail,
        //       batchSize,
        //     ),
        //     fetchGoogleBooks__ByReadingProgress(
        //       "finished",
        //       userEmail,
        //       batchSize,
        //     ),
        //     fetchGoogleBooks__ByReadingProgress("dnf", userEmail, batchSize),
        //   ]);

        setCache({
          wishlist: wishList,
          reading: readingList,
          finished: finishedList,
          dnf: dnfList,
        });
      }
      getAllBooks(user.email, 10);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <MainGrid>
      <SearchBar setCache={setCache} />

      {loggedIn ? (
        <section
          id="accordion-section"
          className="col-span-4 md:col-span-6 lg:col-span-12"
        >
          <div className="accordion-wrapper w-full">
            <Accordion
              type="single"
              collapsible
              defaultValue="accordion-item-1"
            >
              <Dropdown name="Wish List" index={0}>
                {cache && cache["wishlist"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {cache["wishlist"].map((data: BookType, index: number) => (
                      <BookScreen
                        key={index}
                        screenTrigger={<Book key={index} book={data} />}
                      >
                        <BookInfo book={data} setCache={setCache} />
                      </BookScreen>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    You don&apos;t have any books in your wish list!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="Reading" index={1}>
                {cache && cache["reading"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {cache["reading"].map((data: BookType, index: number) => (
                      <BookScreen
                        key={index}
                        screenTrigger={<Book key={index} book={data} />}
                      >
                        <BookInfo book={data} setCache={setCache} />
                      </BookScreen>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;re not reading any books yet!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="Finished" index={2}>
                {cache && cache["finished"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {cache["finished"].map((data: BookType, index: number) => (
                      <BookScreen
                        key={index}
                        screenTrigger={<Book key={index} book={data} />}
                      >
                        <BookInfo book={data} setCache={setCache} />
                      </BookScreen>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;re not reading any books!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="DNF" index={3}>
                {cache && cache["dnf"].length != 0 ? (
                  <div className="books-wrapper horizontal-media-scroller">
                    {cache["dnf"].map((data: BookType, index: number) => (
                      <BookScreen
                        key={index}
                        screenTrigger={<Book key={index} book={data} />}
                      >
                        <BookInfo book={data} setCache={setCache} />
                      </BookScreen>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    You&apos;ve read all your books!
                  </p>
                )}
              </Dropdown>
            </Accordion>
          </div>
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
