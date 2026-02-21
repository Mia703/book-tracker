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
import { addUser } from "@/actions/userActions";

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
      const response = await addUser(
        values.firstName,
        values.lastName,
        values.email,
      );
      if (response.status == "failed" && response.clientMessage) {
        setAlert(response.clientMessage);
      } else {
        const user = response.result;
        window.sessionStorage.setItem("user", JSON.stringify(user));
        router.push("/pages/library");
      }
    },
  });

  return (
    <MainGrid>
      <section
        id="signup"
        className="col-span-4 flex h-[90vh] flex-col content-center justify-center md:col-start-2 lg:col-start-5"
      >
        <Card className="bg-primary-light-pink">
          <CardHeader>
            <CardTitle className="text-center">
              <h1 className="text-xl">Signup</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="" method="post" onSubmit={formik.handleSubmit}>
              <div className="input-wrapper justify-between flex flex-row gap-4 pb-4">
                <div className="input-wrapper w-full flex flex-col">
                  <Label htmlFor="firstName" className="mb-2">
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                </div>

                <div className="input-wrapper w-full flex flex-col">
                  <Label htmlFor="lastName" className="mb-2">
                    Last Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
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
                  placeholder="Email"
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
                Already have an account?{" "}
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
