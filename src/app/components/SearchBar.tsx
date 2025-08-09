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

	function formatSearch(search: string) {
		return search.replaceAll("'", "%27").replaceAll("!", "%21").replaceAll(":", "%3A");
	}

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      if (values.search !== "") {
        console.log(formatSearch(values.search));
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
        <div className="search-wrapper w-full">
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
            <div className="search-results bg-primary-light-pink border-primary-dark-pink z-10 border-r-2 border-b-2 border-l-2 p-4 shadow-md">
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
