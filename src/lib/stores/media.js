import { get, writable } from "svelte/store";
import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export let projectImages = writable(new Map())

export let progress = writable(0);
export let isComplete = writable(false);

export const loadImages = async (imagesByDocId) => {
    let totalImages = 0;
    imagesByDocId.forEach(urls => totalImages += urls.length);
    
    let loaded = 0;
    const loadedImagesByDocId = new Map();

    const allPromises = [];

    for (const [docId, urls] of imagesByDocId) {
        const imagePromises = urls.map((url) => {
            return new Promise((resolve) => {
                const fullUrl = `${PUBLIC_PAYLOAD_URL}${url}`;
                const img = new Image();

                img.onload = () => {
                    loaded++;
                    progress.set((loaded / totalImages) * 100);
                    resolve({ success: true, img });
                };

                img.onerror = (event) => {
                    loaded++;
                    progress.set((loaded / totalImages) * 100);
                    resolve({ success: false, img: null });
                };
                
                img.src = fullUrl;
            });
        });

        allPromises.push(
            Promise.all(imagePromises).then((results) => {
                const images = results
                    .filter(r => r.success)
                    .map(r => r.img);
                loadedImagesByDocId.set(docId, images);
            })
        );
    }

    await Promise.all(allPromises);
    projectImages.set(loadedImagesByDocId);
    isComplete.set(true);
};

const extractImagesByDocId = (docs) => {
    const imagesByDocId = new Map();
    
    docs.forEach((doc) => {
        const urls = doc.otherImages
            .map(i => i.thumbnailURL)
            .filter(url => url != null && url !== '');
        
        if (urls.length > 0) {
            imagesByDocId.set(doc.id, urls);
        }
    });
    
    return imagesByDocId;
}

export const InitMedia = async (data) => {
    const projectImagesByDocId = extractImagesByDocId(data.projects);
    await loadImages(projectImagesByDocId);
}