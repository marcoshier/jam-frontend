import { writable } from "svelte/store";
import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export let progress = writable(0);
export let isComplete = writable(false);

export const loadImages = async (urls) => {
    const validUrls = urls.filter((url) => url != null && url !== '');
    const total = validUrls.length;
    let loaded = 0;

    const promises = validUrls.map((url, index) => {
        return new Promise((resolve) => {
            const fullUrl = `${PUBLIC_PAYLOAD_URL}${url}`;
            const img = new Image();

            img.onload = () => {
                loaded++;
                progress.set((loaded / total) * 100);
                resolve({ success: true, url: fullUrl });
            };

            img.onerror = (event) => {
                loaded++;
                progress.set((loaded / total) * 100);
                resolve({ success: false, url: fullUrl });
            };
            
            img.src = fullUrl;
        });
    });

    const results = await Promise.all(promises);
    //const failed = results.filter(r => !r.success);
    
    isComplete.set(true);
};

const extractImageUrls = (docs) => {
    return docs.flatMap((d) => d.otherImages.map((i) => i.thumbnailURL))
}

export const InitMedia = async (data) => {
    const projectUrls = extractImageUrls(data.projects);
    // const postsUrls = extractImageUrls(data.posts);
    const urls = projectUrls
   
    await loadImages(urls);
}