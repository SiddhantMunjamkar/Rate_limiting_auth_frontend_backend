
import LoginComp from "@/components/login_comp";
import Image from "next/image";

function login() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <LoginComp />
      </div>
      <div className="w-1/2 relative bg-gray-50">
        <Image
          src="/images/Right_sideimage.png"
          alt="Signup Illustration"
          fill
          className="object-fit "
          priority
        />
      </div>
    </div>
  );
}

export default login;
