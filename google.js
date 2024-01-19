


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
        console.log(response)
       
    return formResponse


} 

static async searchNearby(){
    
}


}

module.exports = GoogleDistSearch

