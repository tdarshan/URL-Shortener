import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Error from "./Error";

import * as yup from 'yup';
import useFetch from "@/hooks/useFetch";
import { QRCode } from "react-qrcode-logo";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";



const CreateLink = () => {

    const { user } = UrlState();
    const navigate = useNavigate();

    const ref = useRef();

    let [searParams, setSearchParams] = useSearchParams();

    const longLink = searParams.get("createNew");


    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: ""
    });


    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup.string().url("Must be a valid url").required("Long url is required"),
        customUrl: yup.string()
    });


    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value
        })
    };


    const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, {...formValues, user_id: user.id});


    const createNewLink = async () => {
        setErrors([]);

        try {

            await schema.validate(formValues, {abortEarly: false});
            const canvas = ref.current.canvasRef.current;

            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            await fnCreateUrl(blob);
            
        } catch (e) {
            const newErrors = {};

            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message
            });

            setErrors(newErrors);
        }

    }


    useEffect(() => {
        if(error == null && data) {
            navigate(`/link/${data[0].id}`);
        }
    }, [error, data]);


    return (
        <Dialog 
            defaultOpen={longLink}
            onOpenChange={(res) => {
                if(!res) setSearchParams({})
            } }
        >
            <DialogTrigger>
                <Button varient="secondary">Create New</Button>
            </DialogTrigger>
            <DialogContent classname="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>

                { formValues?.longUrl && <QRCode value={formValues?.longUrl} size={250} ref={ref} /> }

                <Input id="title"
                    placeholder="Short Link's Title"
                    value={formValues.title}
                    onChange={handleChange}
                />
                { errors.title && <Error message={errors.title} />}

                <Input id="longUrl"
                    placeholder="Enter Long Link"
                    value={formValues.longUrl}
                    onChange={handleChange}
                />
                { errors.longUrl &&  <Error message={errors.longUrl} />}

                <div className="flex items-center gap-2">
                    <Card className="p-2">trimmy.in</Card>
                    <Input id="customUrl" placeholder="Custom Link (Optional)" />
                </div>


                { error && <Error message={error.message} />}


                <DialogFooter className="sm:justify-start">
                    <Button disabled={loading} varient="outline" onClick={createNewLink}>
                        {loading ? <BeatLoader size={10} color="white" /> : "Create"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default CreateLink