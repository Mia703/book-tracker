"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import BookForm from "./BookForm";

interface HeaderProps {
  user:
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
      }
    | undefined;
}

export default function MainHeader({ user }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="main-header">
      <div className="buttons-wrapper col-span-2 row-1 flex flex-row justify-end gap-4">
        {/* CREATE YOUR OWN BOOK */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="pink cursor-pointer">
              Add Book
              <Plus />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="overflow-y-scroll p-6">
            <SheetTitle className="text-center text-xl">Add a Book</SheetTitle>
            <BookForm user={user} />
            <SheetFooter className="p-0">
              <SheetClose asChild>
                <Button className="bg-primary-black w-full cursor-pointer">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* UPDATE USER INFORMATION*/}
        <Button
          type="button"
          id="update-user-btn"
          className="pink cursor-pointer"
        >
          Update your information
        </Button>

        {/* LOGOUT BUTTON */}
        <Button
          type="button"
          id="logout-btn"
          className="pink cursor-pointer"
          onClick={() => {
            window.sessionStorage.removeItem("user");
            router.push("/");
          }}
        >
          Logout <LogOut />
        </Button>
      </div>
    </div>
  );
}
