/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BeatLoader } from "react-spinners"

import Error from "./Error"
import { useEffect, useState } from "react"

import * as Yup from 'yup';
import useFetch from "@/hooks/useFetch"
import { signUp } from "@/db/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlState } from "@/context"

const Signup = () => {

  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({ 
    name: "",
    email: "", 
    password: "",
    profile_pic: null 
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const longLink = searchParams.get('createNew');


  const handleChange = (e) => {
      const {name, value, files} = e.target;
      
      setFormData((prevState) => ({
          ...prevState,
          [name]: files ? files[0] : value
      }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signUp, formData);

  const {fetchUser} = UrlState();

  useEffect(() => {

      // console.log(data);
      if(error == null && data) {
          navigate(`/dashboard?${longLink ? `createNew=${longLink}` : "" }`);
          fetchUser();
      }

  }, [data, error]);

  const handleSignup = async () => {

      setErrors([]);
      try {
          
          
          const schema = Yup.object().shape({
              name: Yup.string()
                        .required("Name is required"),
              email: Yup.string()
                      .email("Invalid Emial")
                      .required("Email is required"),
              password: Yup.string()
                      .min(6, 'Password must be atleast 6 characters')
                      .required("Password is required"),
              profile_pic: Yup.mixed().required("Profile picture is required")
          });

          await schema.validate(formData, {abortEarly: false});

          await fnSignup();
          
      } catch (e) {
          const newErrors = {}

          e?.inner?.forEach((err) => {
              newErrors[err.path] = err.message;
          });

          setErrors(newErrors);
      }
  };

  return (
      <Card>
          <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>Create a new Account if you haven&apos;t</CardDescription>
              {error && <Error message={error.message} />}
          </CardHeader>
          <CardContent className='space-y-2'>
              <div className="space-y-1">
                  <Input name='name' type='text' placeholder='Enter Name' onChange={handleChange} />
                  {errors.name && <Error message={errors.name} />}
              </div>
              <div className="space-y-1">
                  <Input name='email' type='email' placeholder='Enter Email' onChange={handleChange} />
                  {errors.email && <Error message={errors.email} />}
              </div>
              <div className="space-y-1">
                  <Input name='password' type='password' placeholder='Enter Password' onChange={handleChange} />
                  {errors.password && <Error message={errors.password} />}
              </div>
              <div className="space-y-1">
                  <Input name='profile_pic' type='file' accept='image/*' onChange={handleChange} />
                  {errors.profile_pic && <Error message={errors.profile_pic} />}
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleSignup}>
                  {loading ? 
                  <BeatLoader size={10} color="#36d7b7" />
                  :
                  "Signup" 
                  }
              </Button>
          </CardFooter>
      </Card>

  )
}

export default Signup