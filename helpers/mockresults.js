const axiosDistance = {data: {
    destination_addresses: [
      'Kastanienallee 4, 10435 Berlin, Germany',
      'Kastanienallee 3, 10435 Berlin, Germany',
      'Oderberger Str. 52, 10435 Berlin, Germany',
      'Oderberger Str. 56, 10435 Berlin, Germany',
      'U Eberswalder Straße, 10437 Berlin, Germany',
      'Schönhauser Allee 38, 10435 Berlin, Germany',
      'Danziger Str, an der Kulturbrauerei, Knaackstraße 10, 10435 Berlin, Germany',
      'Kastanienallee 24, 10435 Berlin, Germany',
      'Kollwitzstraße 47, 10405 Berlin, Germany',
      'Schönhauser Allee 21, 10435 Berlin, Germany',
      'Schönhauser Allee 126, 10437 Berlin, Germany',
      'Prenzlauer Allee 207, 10405 Berlin, Germany',
      'Schönhauser Allee 79-80, 10439 Berlin, Germany',
      'Torstraße 56, 10119 Berlin, Germany',
      'Torstraße 118, 10119 Berlin, Germany',
      'Prenzlauer Allee 176, 10409 Berlin, Germany',
      'Rosenthaler Str. 67, 10119 Berlin, Germany',
      'Schönhauser Allee 104, 10439 Berlin, Germany',
      'Alexander Parkside, 10178 Berlin, Germany',
      'Alexanderpl. 8, 10178 Berlin, Germany'
    ],
    origin_addresses: [ 'Schönhauser Allee 45A, 10437 Berlin, Germany' ],
    rows: [
		{
			"elements": [
				{
					"distance": {
						"text": "0.9 km",
						"value": 934
					},
					"duration": {
						"text": "13 mins",
						"value": 804
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "0.9 km",
						"value": 912
					},
					"duration": {
						"text": "13 mins",
						"value": 786
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.2 km",
						"value": 1208
					},
					"duration": {
						"text": "17 mins",
						"value": 1027
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.2 km",
						"value": 1199
					},
					"duration": {
						"text": "17 mins",
						"value": 1024
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "0.8 km",
						"value": 850
					},
					"duration": {
						"text": "12 mins",
						"value": 702
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.0 km",
						"value": 1027
					},
					"duration": {
						"text": "14 mins",
						"value": 861
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "0.9 km",
						"value": 932
					},
					"duration": {
						"text": "13 mins",
						"value": 782
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.3 km",
						"value": 1274
					},
					"duration": {
						"text": "18 mins",
						"value": 1082
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.6 km",
						"value": 1635
					},
					"duration": {
						"text": "23 mins",
						"value": 1362
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.7 km",
						"value": 1656
					},
					"duration": {
						"text": "23 mins",
						"value": 1366
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "0.8 km",
						"value": 759
					},
					"duration": {
						"text": "11 mins",
						"value": 639
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.6 km",
						"value": 1604
					},
					"duration": {
						"text": "22 mins",
						"value": 1345
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "0.8 km",
						"value": 849
					},
					"duration": {
						"text": "12 mins",
						"value": 692
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "2.3 km",
						"value": 2277
					},
					"duration": {
						"text": "31 mins",
						"value": 1880
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "2.3 km",
						"value": 2338
					},
					"duration": {
						"text": "32 mins",
						"value": 1928
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.6 km",
						"value": 1626
					},
					"duration": {
						"text": "22 mins",
						"value": 1330
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "2.4 km",
						"value": 2435
					},
					"duration": {
						"text": "33 mins",
						"value": 2006
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "1.3 km",
						"value": 1252
					},
					"duration": {
						"text": "18 mins",
						"value": 1064
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "3.0 km",
						"value": 2991
					},
					"duration": {
						"text": "41 mins",
						"value": 2455
					},
					"status": "OK"
				},
				{
					"distance": {
						"text": "3.1 km",
						"value": 3058
					},
					"duration": {
						"text": "42 mins",
						"value": 2530
					},
					"status": "OK"
				}
			]
		}
	],
    status: 'OK'}
  }
  
  const searchDistanceResult = {
    origin: 'Schönhauser Allee 45A, 10437 Berlin, Germany',
    destinations: [
      {
        address: 'Kastanienallee 4, 10435 Berlin, Germany',
        distance: '0.9 km',
        duration_text: '13 mins',
        duration_value_secs: 804,
        mode: 'walking'
      },
      {
        address: 'Kastanienallee 3, 10435 Berlin, Germany',
        distance: '0.9 km',
        duration_text: '13 mins',
        duration_value_secs: 786,
        mode: 'walking'
      },
      {
        address: 'Oderberger Str. 52, 10435 Berlin, Germany',
        distance: '1.2 km',
        duration_text: '17 mins',
        duration_value_secs: 1027,
        mode: 'walking'
      },
      {
        address: 'Oderberger Str. 56, 10435 Berlin, Germany',
        distance: '1.2 km',
        duration_text: '17 mins',
        duration_value_secs: 1024,
        mode: 'walking'
      },
      {
        address: 'U Eberswalder Straße, 10437 Berlin, Germany',
        distance: '0.8 km',
        duration_text: '12 mins',
        duration_value_secs: 702,
        mode: 'walking'
      },
      {
        address: 'Schönhauser Allee 38, 10435 Berlin, Germany',
        distance: '1.0 km',
        duration_text: '14 mins',
        duration_value_secs: 861,
        mode: 'walking'
      },
      {
        address: 'Danziger Str, an der Kulturbrauerei, Knaackstraße 10, 10435 Berlin, Germany',
        distance: '0.9 km',
        duration_text: '13 mins',
        duration_value_secs: 782,
        mode: 'walking'
      },
      {
        address: 'Kastanienallee 24, 10435 Berlin, Germany',
        distance: '1.3 km',
        duration_text: '18 mins',
        duration_value_secs: 1082,
        mode: 'walking'
      },
      {
        address: 'Kollwitzstraße 47, 10405 Berlin, Germany',
        distance: '1.6 km',
        duration_text: '23 mins',
        duration_value_secs: 1362,
        mode: 'walking'
      },
      {
        address: 'Schönhauser Allee 21, 10435 Berlin, Germany',
        distance: '1.7 km',
        duration_text: '23 mins',
        duration_value_secs: 1366,
        mode: 'walking'
      },
      {
        address: 'Schönhauser Allee 126, 10437 Berlin, Germany',
        distance: '0.8 km',
        duration_text: '11 mins',
        duration_value_secs: 639,
        mode: 'walking'
      },
      {
        address: 'Prenzlauer Allee 207, 10405 Berlin, Germany',
        distance: '1.6 km',
        duration_text: '22 mins',
        duration_value_secs: 1345,
        mode: 'walking'
      },
      {
        address: 'Schönhauser Allee 79-80, 10439 Berlin, Germany',
        distance: '0.8 km',
        duration_text: '12 mins',
        duration_value_secs: 692,
        mode: 'walking'
      },
      {
        address: 'Torstraße 56, 10119 Berlin, Germany',
        distance: '2.3 km',
        duration_text: '31 mins',
        duration_value_secs: 1880,
        mode: 'walking'
      },
      {
        address: 'Torstraße 118, 10119 Berlin, Germany',
        distance: '2.3 km',
        duration_text: '32 mins',
        duration_value_secs: 1928,
        mode: 'walking'
      },
      {
        address: 'Prenzlauer Allee 176, 10409 Berlin, Germany',
        distance: '1.6 km',
        duration_text: '22 mins',
        duration_value_secs: 1330,
        mode: 'walking'
      },
      {
        address: 'Rosenthaler Str. 67, 10119 Berlin, Germany',
        distance: '2.4 km',
        duration_text: '33 mins',
        duration_value_secs: 2006,
        mode: 'walking'
      },
      {
        address: 'Schönhauser Allee 104, 10439 Berlin, Germany',
        distance: '1.3 km',
        duration_text: '18 mins',
        duration_value_secs: 1064,
        mode: 'walking'
      },
      {
        address: 'Alexander Parkside, 10178 Berlin, Germany',
        distance: '3.0 km',
        duration_text: '41 mins',
        duration_value_secs: 2455,
        mode: 'walking'
      },
      {
        address: 'Alexanderpl. 8, 10178 Berlin, Germany',
        distance: '3.1 km',
        duration_text: '42 mins',
        duration_value_secs: 2530,
        mode: 'walking'
      }
    ]
  }

const combinedSearchNearby = {places:
    [
        {
          id: 'ChIJw_JYIrLfnUcRuMRzVpMjXAw',
          googleMapsUri: 'https://maps.google.com/?cid=890625942030107832',
          displayName: { text: 'Chandani Chowk Indisches Restaurant', languageCode: 'de' },
          primaryType: 'indian_restaurant'
        },
        {
          id: 'ChIJx5-MpX3fnUcR9Tsy83A7Q2c',
          googleMapsUri: 'https://maps.google.com/?cid=7440856365648722933',
          displayName: { text: 'Pizzesco', languageCode: 'en' },
          primaryType: 'pizza_restaurant'
        },
        {
          id: 'ChIJ3xTjBX3fnUcRKic8QArdNFo',
          googleMapsUri: 'https://maps.google.com/?cid=6500063198299563818',
          displayName: { text: 'Chopan - near Gasteig', languageCode: 'en' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJMS04D33fnUcRWvLPGFdg6jQ',
          googleMapsUri: 'https://maps.google.com/?cid=3812965961717248602',
          displayName: { text: 'Zen Panasia Cuisine', languageCode: 'de' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJl91FBX3fnUcRDxyivHWCIuA',
          googleMapsUri: 'https://maps.google.com/?cid=16150614655891545103',
          displayName: { text: 'Beef Crew', languageCode: 'en' },
          primaryType: 'hamburger_restaurant'
        },
        {
          id: 'ChIJiZZl7UTfnUcRl-G4CPd3Fnc',
          googleMapsUri: 'https://maps.google.com/?cid=8581178042888020375',
          displayName: { text: "KLIMENTI'S Restaurant", languageCode: 'de' },
          primaryType: 'mediterranean_restaurant'
        },
        {
          id: 'ChIJRYT5wvzfnUcRJ-hWmv9AlrY',
          googleMapsUri: 'https://maps.google.com/?cid=13156774827959707687',
          displayName: { text: 'MONA', languageCode: 'de' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJq_jANnzfnUcRtImumpJN4sE',
          googleMapsUri: 'https://maps.google.com/?cid=13970814286112393652',
          displayName: { text: 'Minh Chau', languageCode: 'en' },
          primaryType: 'vietnamese_restaurant'
        },
        {
          id: 'ChIJoUZkytDfnUcR9Gl5PBxAo3A',
          googleMapsUri: 'https://maps.google.com/?cid=8116401443469617652',
          displayName: { text: 'La Rosa', languageCode: 'en' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJN1ZekWLfnUcR1QJuAZdyQKQ',
          googleMapsUri: 'https://maps.google.com/?cid=11835585813619278549',
          displayName: { text: 'Indian Mango', languageCode: 'en' },
          primaryType: 'indian_restaurant'
        },
        {
          id: 'ChIJO6LZKIh1nkcRiYpaRyUkxLw',
          googleMapsUri: 'https://maps.google.com/?cid=13602036517095246473',
          displayName: { text: 'Restaurant Goa', languageCode: 'en' },
          primaryType: 'indian_restaurant'
        },
        {
          id: 'ChIJ-9GniGLfnUcRwLXKGbZzdik',
          googleMapsUri: 'https://maps.google.com/?cid=2987702628760860096',
          displayName: { text: 'La Taquería by Cometa', languageCode: 'de' },
          primaryType: 'mexican_restaurant'
        },
        {
          id: 'ChIJae-yKoh1nkcRpeJ82fhPYbE',
          googleMapsUri: 'https://maps.google.com/?cid=12781585147673502373',
          displayName: { text: 'Restaurant Va Bene', languageCode: 'de' },
          primaryType: 'italian_restaurant'
        },
        {
          id: 'ChIJfdrCf63fnUcRTTGz6YK377k',
          googleMapsUri: 'https://maps.google.com/?cid=13398129189344981325',
          displayName: { text: 'Xin Chao', languageCode: 'en' },
          primaryType: 'vietnamese_restaurant'
        },
        {
          id: 'ChIJKfixltB1nkcR4lsGjMT17TY',
          googleMapsUri: 'https://maps.google.com/?cid=3958089872040156130',
          displayName: { text: 'Pelit Restaurant', languageCode: 'en' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJSx_BTnvfnUcRMlq1h6rebt8',
          googleMapsUri: 'https://maps.google.com/?cid=16100050541898717746',
          displayName: { text: "L'Incontro", languageCode: 'en' },
          primaryType: 'italian_restaurant'
        },
        {
          id: 'ChIJ4TDHRf_fnUcR8gu5pQHq6i0',
          googleMapsUri: 'https://maps.google.com/?cid=3308714169053285362',
          displayName: { text: "Song's Kitchen", languageCode: 'en' },
          primaryType: 'chinese_restaurant'
        },
        {
          id: 'ChIJxQMAbH_fnUcRmvPHuJY6BIQ',
          googleMapsUri: 'https://maps.google.com/?cid=9512792731932947354',
          displayName: { text: 'metz7 Restaurant essen&trinken', languageCode: 'de' },
          primaryType: 'restaurant'
        },
        {
          id: 'ChIJ9UndTIB1nkcRrG3NSOGQ7p8',
          googleMapsUri: 'https://maps.google.com/?cid=11524307793751141804',
          displayName: { text: 'Restaurant Le Faubourg', languageCode: 'fr' },
          primaryType: 'french_restaurant'
        },
        {
          id: 'ChIJZ0aebxbfnUcRTpZfjBZAzQ8',
          googleMapsUri: 'https://maps.google.com/?cid=1138636746383136334',
          displayName: { text: 'Co Thao Restaurant', languageCode: 'en' },
          primaryType: 'restaurant'
        }
      ]
      }

const combinedSearchDistance = {
    
        origin: 'Zellstraße 4, 81667 München, Germany',
        destinations: [
          {
            address: 'Rosenheimer Str. 10, 81669 München, Germany',
            distance: '0.2 km',
            duration_text: '3 mins',
            duration_value_secs: 202,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 12, 81669 München, Germany',
            distance: '0.2 km',
            duration_text: '4 mins',
            duration_value_secs: 232,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 8, 81669 München, Germany',
            distance: '0.2 km',
            duration_text: '4 mins',
            duration_value_secs: 215,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 6, 81669 München, Germany',
            distance: '0.2 km',
            duration_text: '4 mins',
            duration_value_secs: 234,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 2, 81669 München, Germany',
            distance: '0.2 km',
            duration_text: '4 mins',
            duration_value_secs: 240,
            mode: 'walking'
          },
          {
            address: 'Kellerstraße 1, 81667 München, Germany',
            distance: '0.3 km',
            duration_text: '5 mins',
            duration_value_secs: 305,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 15, 81667 München, Germany',
            distance: '0.4 km',
            duration_text: '6 mins',
            duration_value_secs: 379,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 32, 81669 München, Germany',
            distance: '0.3 km',
            duration_text: '6 mins',
            duration_value_secs: 345,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 30, 81669 München, Germany',
            distance: '0.4 km',
            duration_text: '7 mins',
            duration_value_secs: 404,
            mode: 'walking'
          },
          {
            address: 'Zweibrückenstraße 15, 80331 München, Germany',
            distance: '0.5 km',
            duration_text: '7 mins',
            duration_value_secs: 409,
            mode: 'walking'
          },
          {
            address: 'Thierschstraße 8, 80538 München, Germany',
            distance: '0.7 km',
            duration_text: '10 mins',
            duration_value_secs: 596,
            mode: 'walking'
          },
          {
            address: 'Zweibrückenstraße 9, 80331 München, Germany',
            distance: '0.6 km',
            duration_text: '8 mins',
            duration_value_secs: 466,
            mode: 'walking'
          },
          {
            address: 'Isartorpl. 6, 80538 München, Germany',
            distance: '0.7 km',
            duration_text: '10 mins',
            duration_value_secs: 570,
            mode: 'walking'
          },
          {
            address: 'Steinstraße 83, 81667 München, Germany',
            distance: '0.7 km',
            duration_text: '10 mins',
            duration_value_secs: 597,
            mode: 'walking'
          },
          {
            address: 'Johannispl. 21, 81667 München, Germany',
            distance: '0.8 km',
            duration_text: '12 mins',
            duration_value_secs: 718,
            mode: 'walking'
          },
          {
            address: 'Lilienstraße 67, 81669 München, Germany',
            distance: '0.7 km',
            duration_text: '10 mins',
            duration_value_secs: 591,
            mode: 'walking'
          },
          {
            address: 'Rosenheimer Str. 67, 81667 München, Germany',
            distance: '0.7 km',
            duration_text: '10 mins',
            duration_value_secs: 607,
            mode: 'walking'
          },
          {
            address: 'Metzstraße 7, 81667 München, Germany',
            distance: '0.8 km',
            duration_text: '12 mins',
            duration_value_secs: 733,
            mode: 'walking'
          },
          {
            address: 'Kirchenstraße 5, 81675 München, Germany',
            distance: '0.9 km',
            duration_text: '13 mins',
            duration_value_secs: 757,
            mode: 'walking'
          },
          {
            address: 'Wörthstraße 7, 81667 München, Germany',
            distance: '0.9 km',
            duration_text: '13 mins',
            duration_value_secs: 755,
            mode: 'walking'
          }
        ]
      }
      


const combinedSearchResult = {
    
        origin: "Zellstraße 4, 81667 München, Germany",
        destinations: [
            {
                address: "Rosenheimer Str. 10, 81669 München, Germany",
                distance: "0.2 km",
                duration_text: "3 mins",
                duration_value_secs: 202,
                mode: "walking",
                name: "Chandani Chowk Indisches Restaurant",
                place_id: "ChIJw_JYIrLfnUcRuMRzVpMjXAw",
                googlemaps_uri: "https://maps.google.com/?cid=890625942030107832",
                category: "indian_restaurant"
            },
            {
                address: "Rosenheimer Str. 8, 81669 München, Germany",
                distance: "0.2 km",
                duration_text: "4 mins",
                duration_value_secs: 215,
                mode: "walking",
                name: "Chopan - near Gasteig",
                place_id: "ChIJ3xTjBX3fnUcRKic8QArdNFo",
                googlemaps_uri: "https://maps.google.com/?cid=6500063198299563818",
                category: "restaurant"
            }
        ]
    }


    const searchRouteComplexResult= {
        origin: "Zellstraße 4, 81667 München, Germany",
        destinations: [
            {
                address: "Rosenheimer Str. 10, 81669 München, Germany",
                distance: "0.2 km",
                duration_text: "3 mins",
                duration_value_secs: 202,
                mode: "walking",
                name: "Chandani Chowk Indisches Restaurant",
                place_id: "ChIJw_JYIrLfnUcRuMRzVpMjXAw",
                googlemaps_uri: "https://maps.google.com/?cid=890625942030107832",
                category: "indian_restaurant"
            },
            {
                address: "Rosenheimer Str. 8, 81669 München, Germany",
                distance: "0.2 km",
                duration_text: "4 mins",
                duration_value_secs: 215,
                mode: "walking",
                name: "Chopan - near Gasteig",
                place_id: "ChIJ3xTjBX3fnUcRKic8QArdNFo",
                googlemaps_uri: "https://maps.google.com/?cid=6500063198299563818",
                category: "restaurant"
            }
        ]
    }

  

  module.exports = {searchRouteComplexResult, axiosDistance, searchDistanceResult, combinedSearchResult, combinedSearchNearby, combinedSearchDistance}