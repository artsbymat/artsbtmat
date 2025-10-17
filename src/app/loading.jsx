import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="mt-8 flex justify-center">
      <Spinner className="size-5" />
    </div>
  );
}
