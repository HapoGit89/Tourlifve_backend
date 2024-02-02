"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Google = require("./google.js")
const axios = require('axios')
const {axiosDistance, searchDistanceResult, combinedSearchDistance, combinedSearchResult, combinedSearchNearby}= require("../helpers/mockresults.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const unix = require("unix-timestamp")

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


//************************************ */


describe("searchDistance", function () {
   
    jest.mock('axios')
  
    test("works", async function () {
      
        axios.get=jest.fn().mockResolvedValue(axiosDistance)
        const res = await Google.searchDistance({origin:"place_id:ChIJ1dwsev9RqEcRI8M0dW0Lcpw", 
        destinations: "place_id:ChIJv5OqEP9RqEcRlYUSZlZ145c|place_id:ChIJL6PjEpZRqEcRffKhOHqRtGU|place_id:ChIJrcLJx_5RqEcRB_kvIEm_INs|place_id:ChIJc28fha5RqEcRZt7w7jkg0sM|place_id:ChIJKcXMswRRqEcR9zaNyZ7Dcqw|place_id:ChIJmy3ISP5RqEcRlPb6eYXwgXY|place_id:ChIJVazQfi5RqEcRaRl1ddqjiMw|place_id:ChIJCdJjpf5RqEcRt6ecyJ6_I9k|place_id:ChIJg6xGQgJOqEcRscetDS1i5j0|place_id:ChIJ1WYggwJOqEcR9s_PFnb3XHs|place_id:ChIJl20yUAFSqEcRQsGtUnvorAc|place_id:ChIJMzvPLKhPqEcRVCTjqTKU8j4|place_id:ChIJ9XXskAZSqEcRmJ-IIdgMlH4|place_id:ChIJ4arVZuJRqEcRchoLmdyOXQk|place_id:ChIJa0DelkhRqEcRSEHJ1c6DPMY|place_id:ChIJlcfnBytNqEcRFVxI0inJICk|place_id:ChIJQcryI8JRqEcRgjJ-x1SPltM|place_id:ChIJmde0-QVSqEcRZhCs6unUoDc|place_id:ChIJcQyUQxlOqEcRjRS8iaIdgw0|place_id:ChIJqf4XAR9OqEcRMIHAhTrtDHE|",
        mode: "walking"})
        expect(res).toEqual(searchDistanceResult)


    });
  
  });


  describe("combinedSearch", function () {
   
    test("works", async function () {
      
        Google.searchDistance=jest.fn().mockResolvedValue(combinedSearchDistance)
        Google.searchNearby=jest.fn().mockResolvedValue(combinedSearchNearby)
        const res = await Google.combinedSearch({
            origin_id: "ChIJGZydHH3fnUcR4OmcAeTMGVE",
            mode: "walking",
            duration: 220,
            lat: 48.1328889,
            lng:11.5893659,
            query: "restaurant"})
        expect(res).toEqual(combinedSearchResult)


    });
  
  });

