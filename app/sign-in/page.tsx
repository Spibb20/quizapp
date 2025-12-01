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
      <Link href="/sign-up">
        <SignIn routing="hash" />
      </Link>
    </SignedOut>
  );
}
