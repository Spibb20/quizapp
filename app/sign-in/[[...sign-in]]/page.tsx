import Image from "next/image";
import {
  SignIn,
  SignUp,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

/*export default function LoginHome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignedOut>
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="flex border-b">
            <Link
              href="/sign-in"
              className="flex-1 text-center py-2 border-b-2 border-blue-500 text-blue-600"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 text-center py-2 text-gray-500 hover:text-gray-700"
            >
              Sign Up
            </Link>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                formButtonPrimary: `bg-blue-600 hover:bg-blue-700`,
              },
            }}
          />
        </div>
      </SignedOut>
    </div>
  );
}*/
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            },
          }}
        />
      </div>
    </div>
  );
}
