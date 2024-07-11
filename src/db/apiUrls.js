
import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {


    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user_id);


    if (error) {
        console.log(error.message);
        throw new Error("Unable to load message");
    }

    return data;
}

export async function deleteUrl(id) {

    const { data, error } = await supabase
        .from("urls")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }

    return data;

}

export async function createUrl({ title, longUrl, customUrl, user_id }, qrCode) {

    const shortUrl = Math.random().toString(36).substring(2, 6);

    const fileName = `qr-${shortUrl}`;

    const { error: storageError } = await supabase.storage
        .from("qr_codes")
        .upload(fileName, qrCode);


    if (storageError) {
        throw new Error(storageError.message);
    }


    const qr = `${supabaseUrl}/storage/v1/object/public/qr_codes/${fileName}`;


    const { data, error } = await supabase.from('urls').insert([
        {
            title,
            original_url: longUrl,
            custom_url: customUrl || null,
            user_id,
            short_url: shortUrl,
            qr: qr
        }
    ]).select();


    if (error) {
        console.log(error.message);
        throw new Error("Error creating short URL");
    }

    return data;

}


export async function getLongUrl(id) {

    let { data: shortLinkData, error: shortLinkError } = await supabase
        .from("urls")
        .select("id, original_url")
        .or(`short_url.eq.${id},custom_url.eq.${id}`)
        .single();

    if (shortLinkError && shortLinkError.code !== "PGRST116") {
        console.error("Error fetching short link:", shortLinkError);
        return;
    }

    return shortLinkData;
}


export async function getUrl({id, user_id}) {
    const {data, error} = await supabase.from("urls").select("*").eq("id", id).eq("user_id", user_id).single();

    if(error) {
        console.log(error.message);
        throw new Error("Short URL not found");
    }

    return data;
}