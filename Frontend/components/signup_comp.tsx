"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { CustomInput } from "@/components/custom_input";
import { Box, Mail, Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import Link from "next/link";
import { PasswordInput } from "./password_input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/lib/auth";

function SignupComp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const data = JSON.stringify({
      email: email,
      password: password,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3001/api/v1/user/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      router.push("/login");
      // Handle successful signup (e.g., redirect to dashboard)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-0 left-0 flex px-10 py-10">
        <Box className="size-6 text-sky-500" />
        <span className="text-xl pl-1 font-bold">InsideBox</span>
      </div>
      <div className="h-full flex flex-col justify-center items-center px-8">
        <div className="max-w-md w-full">
          <span className="text-sm text-gray-500 mb-2 block">
            Start your journey
          </span>
          <h1 className="font-bold text-3xl mb-8"> Sign Up to InsideBox</h1>
          <div className="mb-4">
            <CustomInput
              label="E-mail"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="custom" size="custom" onClick={handleSignup}>
            Sign Up
          </Button>
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-400">or sign up with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button className="h-14 w-30 bg-gray-50 border hover:bg-gray-100" onClick={googleLogin}>
              <FcGoogle className="size-8" />
            </Button>
            <Button className="h-14 w-30 bg-gray-50 border hover:bg-gray-100">
              <FaFacebook className="size-8 text-blue-600" />
            </Button>
            <Button className="h-14 w-30 bg-gray-50 border hover:bg-gray-100">
              <FaApple className="size-8" color="black" />
            </Button>
          </div>
          <div className="mt-10 text-center text-gray-400">
            Have an account?
            <Link className="text-blue-700" href="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComp;
