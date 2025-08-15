"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@/app/types/types";
import { useFormik } from "formik";
import { LogOut, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchBooks_Top5 } from "../utils/utils";
import BookModal from "./BookModal";
import SearchBarResults from "./SearchBarResults";

export default function SearchBar() {
  const [bookResults, setBookResults] = useState<Book[] | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchToggle, setSearchToggle] = useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async (values) => {
      if (values.search !== "") {
        const response = await searchBooks_Top5(values.search);
        setBookResults(response);
        setSearchToggle(true);
      }
    },
  });

  return (
    <section
      id="search-bar-section"
      className="col-span-4 p-4 md:col-span-6 lg:col-span-12"
    >
      <div className="search-bar-wrapper grid w-full grid-cols-2 justify-end gap-4 md:flex">
        <div className="search-wrapper relative col-span-2 row-2 w-full">
          <form
            action=""
            method="post"
            onSubmit={formik.handleSubmit}
            className="mr-4 flex w-full flex-row"
            id="search-form"
          >
            <Input
              type="search"
              name="search"
              id="search-bar"
              placeholder="Search..."
              className={
                searchToggle
                  ? "bg-primary-light-pink border-primary-dark-pink relative rounded-r-none rounded-bl-none border-2"
                  : "bg-primary-light-pink border-primary-dark-pink rounded-r-none border-2"
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.search}
            />
            <Button
              className={
                searchToggle
                  ? "pink rounded-l-none rounded-br-none hover:cursor-pointer"
                  : "pink rounded-l-none hover:cursor-pointer"
              }
              type="submit"
            >
              <Search />
            </Button>
          </form>
          {searchToggle && (
            <SearchBarResults
              bookResults={bookResults}
              setSelectedBook={setSelectedBook}
              setSearchToggle={setSearchToggle}
              setDisplayModal={setDisplayModal}
            />
          )}

          {/* click on anything below the search bar to close the search results modal */}
          {searchToggle && (
            <div
              className="search-results-background fixed left-0 h-[100vh] w-[100vw]"
              onClick={() => {
                setSearchToggle(false);
              }}
            ></div>
          )}
        </div>

        <div className="buttons-wrapper col-span-2 row-1 flex flex-row justify-end gap-4">
          <Button
            type="button"
            className="add-book-btn pink cursor-pointer"
            onClick={() => {
              setDisplayModal(true);
            }}
          >
            <Plus />
          </Button>
          <Button
            type="button"
            className="logout-btn pink cursor-pointer"
            onClick={() => {
              window.sessionStorage.removeItem("user");
              router.push("/");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </div>
      {displayModal && selectedBook && (
        <BookModal
          book={selectedBook}
          displayUserInfo={false}
          setDisplayModal={setDisplayModal}
          setSearchToggle={setSearchToggle}
        />
      )}
    </section>
  );
}
