import Logo from "@/app/icon.png";
import Image from "next/image";

function LogoImage() {
  return (
    <div className="relative ">
      <Image
        src={Logo}
        alt={"Fatoora Hub - The Ultimate Fatoora Management Platform"}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    </div>
  );
}
export default LogoImage;
