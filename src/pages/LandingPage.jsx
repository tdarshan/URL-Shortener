import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();

    if(longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-5 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-center text-black font-extrabold">
        The only url shortener you will ever need 👇
      </h2>

      <form className="sm:h-14 flex flex-col sm:flex-row  w-full md:w-2/4 gap-2" onSubmit={handleShorten}>
        <Input 
          type='url' 
          placeholder='Enter the loooong url'
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}   
          className='h-full flex-1 py-4 px-4'
        />
        <Button className='h-full' type='submit' varient='ghost'>Shorten!</Button>
      </form>

      <img src="/banner.png" className="w-full my-11 md:px-11" />
    </div>
  )
}

export default LandingPage