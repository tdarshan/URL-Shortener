/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"

import { Button } from "./ui/button"
import { CopyIcon, DownloadIcon, TrashIcon } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import { deleteUrl } from "@/db/apiUrls"
import { BeatLoader } from "react-spinners"
import { useContext, useEffect } from "react"
import { UrlState } from "@/context"


const LinkCard = ({ url, fetchUrls }) => {

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  const {siteOrigin} = UrlState();

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;


    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    anchor.target = "_blank";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  // test
  useEffect(() => {
    console.log(siteOrigin);
  }, []);


  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt={url?.title}
        className="h-32 object-contain ring ring-blue-500 self-start bg-white"
      />

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-white text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-blue-300 text-2xl font-extrabold hover:underline cursor-pointer">
        {siteOrigin}/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="text-white flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="text-white flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-4">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(`${siteOrigin}/${url?.custom_url ? url?.custom_url : url?.short_url}`);
          }}
        >
          <CopyIcon></CopyIcon>
        </Button>
        <Button onClick={downloadImage}>
          <DownloadIcon></DownloadIcon>
        </Button>
        <Button onClick={() => fnDelete().then(() => fetchUrls())}>
          {loadingDelete ? <BeatLoader color="white" size={5} /> : <TrashIcon />}
        </Button>
      </div>

    </div>
  )
}

export default LinkCard