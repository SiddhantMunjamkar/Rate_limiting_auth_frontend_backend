"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/lightdarkbutton";
import Image from "next/image";

interface ProfileProps {
  id: number;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [profile, setProfile] = React.useState<ProfileProps | null>(null);
  // const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3001/api/v1/googleauth/me",
      headers: {
        Authorization: `${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="h-screen relative w-full">
      <div className="flex gap-3 p-4 font-sans text-gray-400 items-center">
        hi there {profile?.name}
        {profile?.avatar && (
          <Image
            src={profile.avatar}
            alt={profile.name || "User avatar"}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
        )}
      </div>
      <div className="flex gap-2 items-center justify-center h-full">
        <Button variant={"outline"} onClick={logout}>
          Logout
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
