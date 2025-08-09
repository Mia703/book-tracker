"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [searchToggle, setSearchToggle] = useState<boolean>(false);

  const router = useRouter();

  function formatSearch(searchInput: string) {
    return (
      searchInput
        // replace punctuation/currency/symbols with %XX
        .replace(/[\p{P}\p{S}]/gu, (char) => {
          const code = char.codePointAt(0);
          return `%${code?.toString(16).toUpperCase().padStart(2, "0")}`;
        })
        // replace spaces between characters with +
        .replace(/(?<=\S) +(?=\S)/g, "+").toLowerCase()
    );
  }

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async (values) => {
      if (values.search !== "") {
        console.log(formatSearch(values.search));

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${formatSearch(values.search)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
          {
            method: "GET",
            headers: { "Content-type": "application/json" },
          },
        );

        if (response.ok) {
          // TODO: do something...
          const data = await response.json();
          console.log(data)
        } else {
          // TODO: do something...
        }
      }

      setSearchToggle(!searchToggle);
    },
  });

  return (
    <section
      id="search-bar-section"
      className="col-span-4 p-4 md:col-span-6 lg:col-span-12"
    >
      <div className="flex flex-row justify-between gap-4">
        <div className="search-wrapper relative w-full">
          <form
            action=""
            method="post"
            onSubmit={formik.handleSubmit}
            className="mr-4 flex w-full flex-row"
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
            <div className="search-results bg-primary-light-pink border-primary-dark-pink fixed left-0 z-10 mx-4 w-full border-r-2 border-b-2 border-l-2 p-4 shadow-md">
              <p>hello world</p>
            </div>
          )}
        </div>
        <Button
          type="button"
          className="pink cursor-pointer"
          onClick={() => {
            window.sessionStorage.removeItem("user");
            router.push("/");
          }}
        >
          Logout <LogOut />
        </Button>
      </div>
    </section>
  );
}
