import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export async function load({ fetch }) {
    const apiUrl = PUBLIC_PAYLOAD_URL;
    
    try {
        console.log("fetching data from", apiUrl)
        const projectsResponse = await fetch(`${apiUrl}/api/projects`);
        const projectsData = await projectsResponse.json();

        console.log(`${apiUrl}/api/projects`)
        console.log(projectsData.docs)

        const postsResponse = await fetch(`${apiUrl}/api/posts`);
        const postsData = await postsResponse.json();
        
        console.log(`${apiUrl}/api/posts`)
        console.log(postsData.docs)

        return {
            projects: projectsData.docs || [],
            posts: postsData.docs || []
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            projects: [],
            posts: []
        };
    }
}