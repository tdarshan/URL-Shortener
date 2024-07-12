/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { BarLoader } from "react-spinners";

import { LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button"
import { CopyIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { BeatLoader } from "react-spinners"

import LocationStats from "@/components/LocationStats";
import DeviceStats from "@/components/DeviceStats";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




const Link = () => {


  const { id } = useParams();
  const { user, siteOrigin } = UrlState();
  const navigate = useNavigate();


  const { loading, data: url, fn, error } = useFetch(getUrl, { id, user_id: user?.id });

  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }


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


  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span
            className="text-4xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>

          <a
            href={`${siteOrigin}/${link}`}
            target="_blank"
            className="text-2xl sm:text-3xl text-blue-300 font-bold hover:underline cursor-pointer"
          >
            {siteOrigin}/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight texl-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`https://trimmy.com/${url?.custom_url ? url?.custom_url : url?.short_url}`);
              }}
            >
              <CopyIcon></CopyIcon>
            </Button>
            <Button onClick={downloadImage}>
              <DownloadIcon></DownloadIcon>
            </Button>
            <Button onClick={() => fnDelete()}>
              {loadingDelete ? <BeatLoader color="white" size={5} /> : <TrashIcon />}
            </Button>
          </div>

          <img
            src={url?.qr}
            alt="url?.title"
            className="w-2/4 self-center sm:self-start ring object-contain p-1"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="font-extrabold">Stats</CardTitle>
          </CardHeader>

          {stats && stats.length ? (
            <CardContent>
              <Card className="mb-2">
                <CardHeader>
                  <CardTitle>
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p> {stats?.length} </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>

                  <CardTitle>Location Data</CardTitle>
                  <LocationStats stats={stats} />

                  <CardTitle>Device Info</CardTitle>
                  <DeviceStats stats={stats} />
                </CardHeader>
              </Card>
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Stats yet" : "Loading Stats..."
              }
            </CardContent>
          )

          }
        </Card>

      </div>
    </>
  )
}

export default Link