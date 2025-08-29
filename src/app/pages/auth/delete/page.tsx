"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, Check } from "lucide-react";
import Link from "next/link";
import MainGrid from "@/app/components/MainGrid";

export default function DeleteAccount() {
  const [alert, setAlert] = useState<{
    status: number | null;
    message: string;
  }>();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const response = await fetch("/pages/api/auth/delete", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("userBookData");
      }
      setAlert({
        status: response.status,
        message: data.message.clientMessage,
      });
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
              <h1 className="text-xl">Delete Account</h1>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="my-4 w-full hover:cursor-pointer"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all the books in your library.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="submit"
                        onClick={() => {
                          formik.submitForm();
                        }}
                      >
                        Continue
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>

            {alert?.status &&
              alert.message &&
              (alert.status < 300 ? (
                <Alert variant={"default"} className="border-green-600">
                  <Check className="stroke-green-600" />
                  <AlertDescription className="text-green-600">
                    {alert.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant={"destructive"}>
                  <AlertCircleIcon />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm">
              <p>
                Back to{"  "}
                <Link href={"/"} className="underline">
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </section>
    </MainGrid>
  );
}
