export async function load({ fetch }) {

    const projectsResponse = await fetch('http://localhost:3000/api/projects')
    const projectsData = await projectsResponse.json()

    const postsResponse = await fetch('http://localhost:3000/api/posts')
    const postsData = await postsResponse.json()

    return {
        projects: projectsData.docs,
        posts: postsData.docs
    }
}
