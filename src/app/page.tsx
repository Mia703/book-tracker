"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import MainGrid from "./components/MainGrid";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { getUser } from "@/actions/userActions";

export default function Home() {
  const [alert, setAlert] = useState<string>("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const response = await getUser(values.email);

      if (response.status == "success") {
        const user = response.result;
        window.sessionStorage.setItem("user", JSON.stringify(user));
        router.push("/pages/library");
      } else {
        if (response.clientMessage) {
          setAlert(response.clientMessage);
        }
      }
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
              <h1 className="text-xl">Login</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="" method="post" onSubmit={formik.handleSubmit}>
              <Label htmlFor="email" className="mb-2">
                Email<span className="text-red-500">*</span>
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
              <Link href={"/pages/auth/delete"} className="underline">
                Delete Account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </section>
    </MainGrid>
  );
}
