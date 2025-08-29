"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, BooksList } from "@/app/types/types";
import { useFormik } from "formik";
import { LogOut, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { searchBooks_Top5 } from "../pages/utils/utils";
import SearchResults from "./SearchResults";
import BookCreateForm from "./BookCreateForm";

type SearchBarProps = {
  setResults: Dispatch<SetStateAction<BooksList>>;
};

export default function SearchBar({ setResults }: SearchBarProps) {
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

          {searchToggle && (
            <SearchResults bookResults={bookResults} setResults={setResults} />
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
          {/* CREATE YOUR OWN BOOK */}
          {/* TODO: would have to fix xata db to accommodate books */}
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button className="pink cursor-pointer">
                <Plus />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-scroll p-6">
              <SheetTitle className="text-xl text-center">Create a Book</SheetTitle>
              <SheetDescription className="text-center">Can&apos;t find a book? Create your own!</SheetDescription>
              <BookCreateForm setResults={setResults} />
              <SheetFooter className="p-0">
                <SheetClose asChild>
                  <Button className="bg-primary-black w-full cursor-pointer">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet> */}

          {/* LOGOUT BUTTON */}
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
