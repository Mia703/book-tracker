"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, LibraryList } from "@/app/types/types";
import { useFormik } from "formik";
import { LogOut, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import SearchResults from "./SearchResults";
import BookCreateForm from "./BookCreateForm";
import { fetchGoogleBooks } from "../pages/utils/utils";

type SearchBarProps = {
  setCache: Dispatch<SetStateAction<LibraryList>>;
};

export default function SearchBar({ setCache }: SearchBarProps) {
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [displaySearchResults, setDisplaySearchResults] =
    useState<boolean>(false);

  const pageRouter = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async (values) => {
      if (values.search !== "") {
        const searchResults = await fetchGoogleBooks(5, values.search);

        if (searchResults) {
          setSearchResults(searchResults);
          setDisplaySearchResults(true);
        }
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
                displaySearchResults
                  ? "bg-primary-light-pink border-primary-dark-pink relative rounded-r-none rounded-bl-none border-2"
                  : "bg-primary-light-pink border-primary-dark-pink rounded-r-none border-2"
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.search}
            />
            <Button
              className={
                displaySearchResults
                  ? "pink rounded-l-none rounded-br-none hover:cursor-pointer"
                  : "pink rounded-l-none hover:cursor-pointer"
              }
              type="submit"
            >
              <Search />
            </Button>
          </form>

          {displaySearchResults && (
            <SearchResults bookList={searchResults} setCache={setCache} />
          )}

          {/* click on anything below the search bar to close the search results modal */}
          {displaySearchResults && (
            <div
              className="search-results-background fixed left-0 h-[100vh] w-[100vw]"
              onClick={() => {
                setDisplaySearchResults(false);
              }}
            ></div>
          )}
        </div>

        <div className="buttons-wrapper col-span-2 row-1 flex flex-row justify-end gap-4">
          {/* CREATE YOUR OWN BOOK */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="pink cursor-pointer">
                Add Book
                <Plus />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-scroll p-6">
              <SheetTitle className="text-center text-xl">
                Create a Book
              </SheetTitle>
              <SheetDescription className="text-center">
                Can&apos;t find a book? Create your own!
              </SheetDescription>
              <BookCreateForm setCache={setCache} />
              <SheetFooter className="p-0">
                <SheetClose asChild>
                  <Button className="bg-primary-black w-full cursor-pointer">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* LOGOUT BUTTON */}
          <Button
            type="button"
            id="logout-btn"
            className="pink cursor-pointer"
            onClick={() => {
              window.sessionStorage.removeItem("user");
              window.sessionStorage.removeItem("userBookData");
              pageRouter.push("/");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </div>
    </section>
  );
}
