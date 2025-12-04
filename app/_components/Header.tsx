import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

Image;

export const Header = () => {
  return (
    <div className="w-full h-[10%] p-2 flex items-center justify-between border-b">
      <p className="font-bold">Quiz app</p>
      <UserButton></UserButton>
    </div>
  );
};
<div className="size-10 rounded-4xl overflow-hidden">
  <Image src="/profile.jpg" alt="profile avatar" height={40} width={40}></Image>
</div>;
