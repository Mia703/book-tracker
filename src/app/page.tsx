"use client";
import { Input } from "@/components/ui/input";
import MainGrid from "./components/MainGrid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Home() {
  const [alert, setAlert] = useState<string>("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const response = await fetch("/pages/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = JSON.parse(data.message.user);
        window.sessionStorage.setItem(
          "user",
          JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            email: values.email,
          }),
        );

        router.push("/pages/library");
      } else {
        setAlert(data.message.message);
        console.error(`Error (${response.status})`, data.message.message);
      }
    },
  });

  return (
    <MainGrid>
      <section
        id="login"
        className="col-span-4 flex h-dvh flex-col content-center justify-center p-4 md:col-start-2 lg:col-start-5"
      >
        <Card className="bg-primary-light-pink">
          <CardHeader>
            <CardTitle className="text-center">
              <h1>Login</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="" method="post" onSubmit={formik.handleSubmit}>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email*"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <Button
                type="submit"
                className="pink my-4 w-full hover:cursor-pointer"
              >
                Login
              </Button>
            </form>
            {alert && (
              <Alert variant={"destructive"}>
                <AlertCircleIcon />
                <AlertTitle>Unable to Login</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm">
              <p>
                Don&apos;t have an account?{" "}
                <Link href={"/pages/auth/signup"} className="underline">
                  Signup
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
