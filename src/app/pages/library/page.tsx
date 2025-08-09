"use client";
import MainGrid from "@/app/components/MainGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Library() {
  const [searchToggle, setSearchToggle] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      if (values.search !== "") {
        const searchInput = values.search
          .replaceAll(" ", "+")
          .replaceAll("'", "%0027");
        console.log(searchInput);
      }

      setSearchToggle(!searchToggle);
    },
  });

  return (
    <MainGrid>
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
                    ? "rounded-l-none rounded-br-none hover:cursor-pointer"
                    : "rounded-l-none hover:cursor-pointer"
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
            onClick={() => {
              window.sessionStorage.removeItem("user");
              router.push("/");
            }}
          >
            Logout <LogOut />
          </Button>
        </div>
      </section>
    </MainGrid>
  );
}
