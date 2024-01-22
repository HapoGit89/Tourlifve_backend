


const {API_KEY} = require("./config.js")
const axios = require("axios")



class GoogleDistSearch{


// Uses GoogleDistance Matrix to get distances between one origin anmd multiple destinations
static async searchDistance(
    {origin, destinations, mode}) {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?&key=${API_KEY}`,
        {params:
        {mode: mode,
        origins: origin,
        destinations: destinations
        }},
        )
        const formResponse = {}
        formResponse.origin = response.data.origin_addresses[0]
        formResponse.destinations = []
        for (let i= 0; i<response.data.destination_addresses.length; i++){
            formResponse.destinations.push({
                address: response.data.destination_addresses[i],
                distance: response.data.rows[0].elements[i].distance.text,
                duration_text:response.data.rows[0].elements[i].duration.text,
                duration_value_secs: response.data.rows[0].elements[i].duration.value,
                mode: mode})
        }
       
    return formResponse


} 

static async searchNearby({lat, lng, query}){
    const response = await axios.post(`https://places.googleapis.com/v1/places:searchText/`, {
        textQuery: query,
	    rankPreference: "DISTANCE",
	   locationBias: {
		  circle: {
            center: {
                latitude: lat,
                longitude: lng
            }
            }
        }},{headers:
        {"X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
        "X-Goog-Api-Key": API_KEY
    }})
        console.log(response)
        return response.data

}

static async combinedSearch({origin_id, mode,lat,lng, query, duration}){
    const places = await this.searchNearby({lat:lat,lng:lng,query:query})

    // build destinations string for Distance Search
    let destinations = ""
    places.places.forEach((el)=>destinations += `place_id:${el.id}|`)


    // Search for distances between origin and places
    let distances = await this.searchDistance({origin:`place_id:${origin_id}`, destinations: destinations, mode:mode})

   // combine places results and distances results
    for (let i = 0; i < distances.destinations.length ; i++){
        distances.destinations[i].name = places.places[i].displayName.text
        distances.destinations[i].place_id = places.places[i].id
    }


    // filter out destinations which dont fit the travel criteria
   distances.destinations = distances.destinations.filter((e)=> e.duration_value_secs<duration)
    return distances

}




}

module.exports = GoogleDistSearch

