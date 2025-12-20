import Image from "next/image";
import SignupComp from "@/components/signup_comp";

function Signup() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <SignupComp />
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

export default Signup;
