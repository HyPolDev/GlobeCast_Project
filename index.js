
const APIkey = "46abcce013a76ed99dd38a119eea156d03ce8bc001939c592366a625abba1c0e"

// fetch('n')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));



// function setup() {
//     noLoop();
// }
// function preload() { // https://serpapi.com/searches/405d1360d3939fc0/65cfe2d0ad7fa9a570900c92.json
//     loadJSON('https://rickandmortyapi.com/api/character', gotData);

// }
// function gotData(data) {
//     console.log(data);
// }

/////////////////////////
const axios = require("axios");

const bringFlights = async () => {
    try {
        // search parametres
        let departure_id = "VLC"
        let arrival_id = "BCN"
        let outbound_date = "2024-02-17"
        let return_date = "2024-02-23"
        let currency = "EUR"
        let lang = "EN"

        // fetching information
        const Vuelos = await axios.get(
            // `https://rickandmortyapi.com/api/character/?page=2`
            `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&return_date=${return_date}&currency=${currency}&hl=${lang}&api_key=46abcce013a76ed99dd38a119eea156d03ce8bc001939c592366a625abba1c0e`
        );

        // all information
        let allFlights = Vuelos.data.best_flights

        // printing information in console
        for (f of allFlights) {
            console.log(`----------------------`)
            console.log(`From: ${f.flights[1].departure_airport.name} (${f.flights[1].departure_airport.id})`);
            console.log(`To: ${f.flights[1].arrival_airport.name} (${f.flights[1].arrival_airport.id})`);
            console.log("")
            console.log("Flight number:", f.flights[1].flight_number)
            console.log(`Duration: ${f.flights[1].duration} min`)
            console.log("")
            console.log(`Price: ${f.price}€`)
            console.log("----------------------")

        }
        // console.log(Vuelos.data.best_flights);
    } catch (error) {
        console.log(error, "Sorry, there are no flights for that route and dates");
    }
};

bringFlights();