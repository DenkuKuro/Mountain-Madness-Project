document.addEventListener("DOMContentLoaded", () => {

    const graphContainer = document.querySelector(".graph");
    const load = document.querySelector(".honeycomb")
    
    // Show loading for exactly 3 seconds, then switch to video
    setTimeout(() => {
        load.style.display = "none"; // Hide loading icon
        
    }, 4000); // 3 seconds delay
});



