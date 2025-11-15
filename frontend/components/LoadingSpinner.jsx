import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-acc-blue mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}