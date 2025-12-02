import Image from "next/image";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function LoginHome() {
  return (
    <SignedOut>
      <Link href="sign-up" className="flex flex-col  items-center">
        <SignIn routing="hash" withSignUp />
        <p>Don't have an account? </p>
        Sign Up
      </Link>
    </SignedOut>
  );
}
