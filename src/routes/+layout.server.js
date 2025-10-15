import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ fetch }) {
    const apiUrl = PUBLIC_API_URL || 'http://localhost:3000';
    
    try {
        const projectsResponse = await fetch(`${apiUrl}/api/projects`);
        const projectsData = await projectsResponse.json();

        const postsResponse = await fetch(`${apiUrl}/api/posts`);
        const postsData = await postsResponse.json();

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