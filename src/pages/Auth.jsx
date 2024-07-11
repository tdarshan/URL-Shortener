/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useSearchParams } from "react-router-dom"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { UrlState } from "@/context";
import { useEffect } from "react";


const Auth = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {isAuthenticated, loading} = UrlState(); 
  const longLink = searchParams.get("createNew");




  useEffect(() => {
    if(isAuthenticated) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : "" }`);
    }

  }, [isAuthenticated, loading]);


  return (
    <div className="mt-24 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {searchParams.get("createNew") ? "Hold up! Let's login first" : "Login/SignUp"}
      </h1>


      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value="login">Log-in</TabsTrigger>
          <TabsTrigger value="signup">Sign-up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>


    </div>
  )
}

export default Auth