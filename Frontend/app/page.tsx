"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/lightdarkbutton";

interface ProfileProps {
  email: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [profile, setProfile] = React.useState<ProfileProps | null>(null);
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
      url: "http://localhost:3001/api/v1/user/profile",
      headers: {
        Authorization: `${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.user));
        setProfile(response.data.user);
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
      <div className="flex  font-sans  text-gray-400">
        hi there {profile?.email}
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
