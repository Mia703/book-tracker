"use client";
import MainGrid from "@/app/components/MainGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Library() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      const searchInput = values.search
        .replaceAll(" ", "+")
        .replaceAll("'", "%0027");
      console.log(searchInput);
    },
  });

  return (
    <MainGrid>
      <section
        id="search-bar-section"
        className="col-span-4 p-4 md:col-span-6 lg:col-span-12"
      >
        <div className="search-wrapper flex flex-row justify-between">
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
              className="bg-primary-light-pink border-primary-dark-pink rounded-r-none border-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.search}
            />
            <Button
              className="rounded-l-none hover:cursor-pointer"
              type="submit"
            >
              <Search />
            </Button>
          </form>

          <Button
            type="button"
            onClick={() => {
              window.sessionStorage.removeItem('user');
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
