import HeadingPage from "@/components/public/HeadingPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  const title = "Page Not Found";
  const description =
    "Looks like this idea hasn’t sprouted yet. Return to the garden and explore other thoughts.";
  return (
    <div className="w-full">
      <HeadingPage title={title} description={description}>
        <Button className="mt-4" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </HeadingPage>
    </div>
  );
}
