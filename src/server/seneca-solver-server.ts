"use server"

async function get_signed_url(url_id_a: string, url_id_b: string) {
    try {
        const response = await fetch(
            `https://seneca.ellsies.tech/api/courses/${url_id_a}/signed-url?sectionId=${url_id_b}`, {
            headers: {
              accept: "*/*",
              "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            },
            method: "GET",
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response_data = await response.json();
    
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response_data
    }
    catch (e) {
        console.error(e)
    }
}

export default async function get_answer(url_id_a: string, url_id_b: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signed_url: {url: string} = await get_signed_url(url_id_a, url_id_b)

    try {
        const response = await fetch(
            signed_url.url, {
            headers: {
              accept: "*/*",
              "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            },
            method: "GET",
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response_data = await response.json();
    
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response_data
    }
    catch (e) {
        console.error(e)
    }
}