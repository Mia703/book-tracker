import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

type BookScreenProps = {
  children: React.ReactNode;
  screenTrigger: React.ReactNode;
};

export default function BookScreen({
  children,
  screenTrigger
}: BookScreenProps) {

  return (
    <Sheet>
      <SheetTrigger>{screenTrigger}</SheetTrigger>
      <SheetContent side="right" className="overflow-y-scroll p-6">
        {children}
        <SheetFooter className="p-0">
          <SheetClose asChild>
            <Button className="bg-primary-black w-full cursor-pointer">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
