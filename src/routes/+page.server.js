export async function load({ fetch }) {

    const projects = [
        { id: 0, title: 'Project Alpha', description: 'Cool project' },
        { id: 1, title: 'Project Alpha', description: 'Cool project' },
        { id: 2, title: 'Project Beta', description: 'Another project' },
        { id: 3, title: 'Project Gamma', description: 'Third project' },
        { id: 4, title: 'Project Beta', description: 'Another project' },
        { id: 5, title: 'Project Gamma', description: 'Third project' },
        { id: 6, title: 'Project Beta', description: 'Another project' },
        { id: 7, title: 'Project Gamma', description: 'Third project' },
        { id: 8, title: 'Project Beta', description: 'Another project' },
        { id: 9, title: 'Project Gamma', description: 'Third project' },
        { id: 10, title: 'Project Beta', description: 'Another project' },
        { id: 11, title: 'Project Gamma', description: 'Third project' },
        { id: 12, title: 'Project Beta', description: 'Another project' },
        { id: 13, title: 'Project Gamma', description: 'Third project' }

    ];

    const blogPosts = [
        { id: 1, title: 'First Blog Post', excerpt: 'This is my first post', date: '2025-01-15' },
        { id: 2, title: 'Second Blog Post', excerpt: 'Another great post', date: '2025-02-20' },
        { id: 3, title: 'Third Blog Post', excerpt: 'More content here', date: '2025-03-10' }
    ];

    return {
        projects,
        blogPosts
    };
}
