"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MainGrid from "@/app/components/MainGrid";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [alert, setAlert] = useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: async (values) => {
      if (values.firstName !== "" && values.lastName !== "") {
        const response = await fetch("/pages/api/auth/signup", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          window.sessionStorage.setItem(
            "user",
            JSON.stringify({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            }),
          );

          router.push("/pages/library");
        } else {
          setAlert(data.message.clientMessage);
          console.error(
            `Error ${response.status}`,
            data.message.developerMessage,
          );
        }
      }
    },
  });

  return (
    <MainGrid>
      <section
        id="signup"
        className="col-span-4 flex h-dvh flex-col content-center justify-center p-4 md:col-start-2 lg:col-start-5"
      >
        <Card className="bg-primary-light-pink">
          <CardHeader>
            <CardTitle className="text-center">
              <h1 className="text-xl">Signup</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="" method="post" onSubmit={formik.handleSubmit}>
              <div className="input-wrapper flex flex-row gap-4 pb-4">
                <div className="input-wrapper flex flex-col">
                  <Label htmlFor="firstName" className="mb-2">
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                </div>

                <div className="input-wrapper flex flex-col">
                  <Label htmlFor="lastName" className="mb-2">
                    Last Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                </div>
              </div>

              <div className="input-wrapper flex flex-col">
                <Label htmlFor="email" className="mb-2">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email*"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              <Button
                type="submit"
                className="pink my-4 w-full hover:cursor-pointer"
              >
                Signup
              </Button>
            </form>
            {alert && (
              <Alert variant={"destructive"}>
                <AlertCircleIcon />
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm">
              <p>
                Have an account?{" "}
                <Link href={"/"} className="underline">
                  Login
                </Link>
                .
              </p>
            </div>
          </CardFooter>
        </Card>
      </section>
    </MainGrid>
  );
}
