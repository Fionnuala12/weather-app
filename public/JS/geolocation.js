/* console.log("script loaded!");

function getLocation() {
    console.log("getLocation() function is running!");

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude, "Longitude:", longitude);

            fetch(`/geolocation?latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET'
            })
            .then(response => {
                console.log("Raw response:", response);

                if(!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json(); // Convert raw response to JSON
            })
            .then(data => {
                console.log("Weather:", data); 
                document.body.innerHTML = JSON.stringify(data, null, 2);
             }) // Work with the parsed data
            .catch(error => console.log("Error:", error)); // Handle errors
        }); 
    } else {
        console.log("Geolocation not supported");
    }
}

getLocation(); */ 