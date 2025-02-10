<script lang="ts">
    export let image = undefined;
    export let size = '100%';
</script>

<div 
    class="square" 
    style="width: {size}; height: {size};"
>
    {#if image}
        <img 
            src={image} 
            alt="" 
            style="width: 100%; height: 100%; object-fit: cover;"
        />
    {/if}
</div>

<style>
    .square {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    img {
        display: block;
    }
</style> 