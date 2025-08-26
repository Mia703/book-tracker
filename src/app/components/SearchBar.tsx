"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@/app/types/types";
import { useFormik } from "formik";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchBooks_Top5 } from "../utils/utils";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const [bookResults, setBookResults] = useState<Book[] | null>(null);
  const [searchToggle, setSearchToggle] = useState<boolean>(false);

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
      id="search-bar"
      className="col-span-4 p-4 md:col-span-6 lg:col-start-4"
    >
      {/* SEARCH BAR */}
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

          {searchToggle && <SearchResults bookResults={bookResults} />}

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

        {/* LOGOUT BUTTON */}
        <div className="buttons-wrapper col-span-2 row-1 flex flex-row justify-end gap-4">
          <Button
            type="button"
            id="logout-btn"
            className="pink cursor-pointer"
            onClick={() => {
              window.sessionStorage.removeItem("user");
              window.sessionStorage.removeItem("userBookData");
              router.push("/");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </div>
    </section>
  );
}
