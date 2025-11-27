import Image from "next/image";

Image;

export const Header = () => {
  return (
    <div>
      <p>Quiz app</p>
      <div className="size-10 rounded-2xl">
        <Image
          src="profile.jpg"
          alt="profile avatar"
          height={40}
          width={40}
        ></Image>
      </div>
    </div>
  );
};
