import Image from "next/image";
import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignUp,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function LoginHome() {
  return (
    <SignedOut>
      <Link href="/sign-up">
        {" "}
        <SignUp />
      </Link>
    </SignedOut>
  );
}
