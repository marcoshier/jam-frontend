import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export async function load({ fetch }) {
    const apiUrl = PUBLIC_PAYLOAD_URL;
    console.log("API URL:", apiUrl);
    
    try {
        console.log("Fetching projects from:", `${apiUrl}/api/projects`);
        const projectsResponse = await fetch(`${apiUrl}/api/projects`);
        console.log("Projects response status:", projectsResponse.status);
        console.log("Projects response ok:", projectsResponse.ok);
        
        const projectsData = await projectsResponse.json();
        console.log("Projects data received:", projectsData);

        const postsResponse = await fetch(`${apiUrl}/api/posts`);
        console.log("Posts response status:", postsResponse.status);
        
        const postsData = await postsResponse.json();
        console.log("Posts data received:", postsData);

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