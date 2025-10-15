<script>
    import { projectsById } from "$lib/stores/projects";
    import { selectedId } from "$lib/stores/ui";
    
    const currentProject = $derived($projectsById.get($selectedId));
    
    $effect(() => {
        console.log('Current Project changed:', currentProject);
    });
</script>