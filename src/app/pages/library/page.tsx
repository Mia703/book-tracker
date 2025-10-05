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
import { fetchBooksByReadingProgress } from "../utils/utils";

export default function Library() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [cache, setCache] = useState<LibraryList>({
    wishlist: [],
    reading: [],
    finished: [],
    dnf: [],
  });

  const router = useRouter();

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

  useEffect(() => {
    const userData = window.sessionStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setLoggedIn(true);

      async function getAllBooks(userEmail: string) {
        const wishList = await fetchBooksByReadingProgress(
          "wishlist",
          userEmail,
        );
        const readingList = await fetchBooksByReadingProgress(
          "reading",
          userEmail,
        );
        const finishedList = await fetchBooksByReadingProgress(
          "finished",
          userEmail,
        );
        const dnfList = await fetchBooksByReadingProgress(
          "dnf",
          userEmail,
        );

        setCache({
          wishlist: wishList,
          reading: readingList,
          finished: finishedList,
          dnf: dnfList,
        });

        setIsLoading(false);
      }
      
      getAllBooks(user.email);
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
                {isLoading ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : cache && cache["wishlist"].length != 0 ? (
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
                    You&apos;re not reading any books yet!
                  </p>
                )}
              </Dropdown>

              <Dropdown name="Reading" index={1}>
                {isLoading ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : cache && cache["reading"].length != 0 ? (
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
                {isLoading ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : cache && cache["finished"].length != 0 ? (
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
                {isLoading ? (
                  <div
                    className="loading-wrapper horizontal-media-scroller"
                    style={{ overflow: "hidden" }}
                  >
                    {placeholder}
                  </div>
                ) : cache && cache["dnf"].length != 0 ? (
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
