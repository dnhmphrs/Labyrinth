<script>
    import { onMount } from 'svelte';
    import Square from '$lib/components/Square.svelte';
    import mazeConfig from '$lib/config/maze.json';
    import { keypressHistory, addKeypress } from '$lib/store/keypressStore.js';
    
    let currentPosition = { x: 0, y: 0 };
    let grid = mazeConfig.grid;
    let squareSize = 0;
    
    function calculateSize() {
        const gap = 32; // 2rem gap between squares
        const pageMargin = gap; // Make page margin same as gap
        const minScreenDim = Math.min(window.innerWidth, window.innerHeight);
        // Size for 3 squares plus 2 gaps, with equal margins
        squareSize = (minScreenDim - (4 * gap)) / 3;
    }
    
    function preloadImages() {
        grid.flat().forEach(square => {
            const img = new Image();
            img.src = square.image;
        });
    }
    
    function handleKeydown(event) {
        const key = event.key;
        if (!key.startsWith('Arrow')) return;
        
        let newX = currentPosition.x;
        let newY = currentPosition.y;
        
        switch(key) {
            case 'ArrowUp': newY = Math.max(0, newY - 1); break;
            case 'ArrowDown': newY = Math.min(grid.length - 1, newY + 1); break;
            case 'ArrowLeft': newX = Math.max(0, newX - 1); break;
            case 'ArrowRight': newX = Math.min(grid[0].length - 1, newX + 1); break;
        }
        
        currentPosition = { x: newX, y: newY };
        addKeypress(key);
    }
    
    onMount(() => {
        calculateSize();
        window.addEventListener('resize', calculateSize);
        preloadImages();
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('resize', calculateSize);
            window.removeEventListener('keydown', handleKeydown);
        };
    });
    
    $: currentSquare = grid[currentPosition.y][currentPosition.x];
    $: adjacentSquares = {
        up: currentPosition.y > 0 && grid[currentPosition.y - 1][currentPosition.x],
        down: currentPosition.y < grid.length - 1 && grid[currentPosition.y + 1][currentPosition.x],
        left: currentPosition.x > 0 && grid[currentPosition.y][currentPosition.x - 1],
        right: currentPosition.x < grid[0].length - 1 && grid[currentPosition.y][currentPosition.x + 1]
    };
</script>

<div class="keypress-history">
    <div class="keypress-history-header">keypresses</div>
    {#each $keypressHistory as press}
        <div class="keypress-entry">
            {press.key.startsWith('Arrow') ? 
                (press.key === 'ArrowUp' ? '↑' : 
                 press.key === 'ArrowDown' ? '↓' : 
                 press.key === 'ArrowLeft' ? '←' : '→') : 
                press.key}
            - {press.timestamp.toFixed(2)}ms
        </div>
    {/each}
</div>

<div class="maze-container">
    <div class="maze-grid">
        <div class="row"><Square image={adjacentSquares.up?.image} size="{squareSize}px" /></div>
        <div class="row">
            <Square image={adjacentSquares.left?.image} size="{squareSize}px" />
            <Square image={currentSquare.image} size="{squareSize}px" />
            <Square image={adjacentSquares.right?.image} size="{squareSize}px" />
        </div>
        <div class="row"><Square image={adjacentSquares.down?.image} size="{squareSize}px" /></div>
    </div>
</div>

<style>
    .maze-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
    }
    
    .keypress-history {
        position: fixed;
        left: 0;
        top: 0;
        padding: 1rem;
        height: 100vh;
        overflow-y: hidden;
        z-index: 1;
    }
    
    .maze-grid {
        display: grid;
        gap: 2rem;
    }
    
    .row {
        display: flex;
        gap: 2rem;
        justify-content: center;
    }
</style>
