function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`/geolocation?latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET'
            })
            .then(response => response.json()) // Convert raw response to JSON
            .then(data => console.log("Weather:", data)) // Work with the parsed data
            .catch(error => console.log("Error:", error)); // Handle errors
        }); 
    } else {
        console.log("Geolocation not supported");
    }
}
