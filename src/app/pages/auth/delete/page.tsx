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
import { Label } from "@radix-ui/react-label";
import { removeUserByEmail } from "@/actions/userActions";

export default function DeleteAccount() {
  const [alert, setAlert] = useState<{
    status: string;
    clientMessage: string;
    display: boolean;
  }>({ status: "", clientMessage: "", display: false });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const response = await removeUserByEmail(values.email);
      setAlert({
        status: response.status,
        clientMessage: response.clientMessage,
        display: true,
      });
    },
  });

  return (
    <MainGrid>
      <section
        id="login"
        className="col-span-4 flex h-[90vh] flex-col content-center justify-center md:col-start-2 lg:col-start-5"
      >
        <Card className="bg-primary-light-pink">
          <CardHeader>
            <CardTitle className="text-center">
              <h1 className="text-xl">Delete Account</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="" method="post" onSubmit={formik.handleSubmit}>
              <Label htmlFor="email" className="mb-2">
                Email
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email*"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                // prevent submitting form through enter
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </form>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant={"destructive"}
                  className="my-4 w-full bg-red-700 hover:cursor-pointer"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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

            {alert.display ? (
              alert.status == "success" ? (
                <Alert variant={"default"} className="border-green-600">
                  <Check className="stroke-green-600" />
                  <AlertDescription className="text-green-600">
                    {alert.clientMessage}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant={"destructive"}>
                  <AlertCircleIcon />
                  <AlertDescription>{alert.clientMessage}</AlertDescription>
                </Alert>
              )
            ) : (
              <p></p>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm">
              <p>
                Back to{"  "}
                <Link href={"/"} className="underline">
                  Login
                </Link>
                .<br />
                Don&apos;t have an account?{" "}
                <Link href={"/pages/auth/signup"} className="underline">
                  Sign up
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
