import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FileQuestion className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
