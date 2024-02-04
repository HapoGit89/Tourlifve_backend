process.env.NODE_ENV = "test"

const request = require ("supertest")
const app = require("../app")
const Google = require("../models/google")
const {searchRouteComplexResult} = require("../helpers/mockresults")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);




  describe("POST /complex", ()=>{
    test("works", async ()=>{
        Google.combinedSearch = jest.fn().mockResolvedValue(searchRouteComplexResult

        )
        const res1 =  await request(app).post("/auth/token").send({username: "u1", password: "password1"})
        const res2 = await request(app).post("/search/complex").set('authorization', res1.body.token).send({
            origin_id: "ChIJGZydHH3fnUcR4OmcAeTMGVE",
            mode: "walking",
            duration: 220,
            lat: 48.1328889,
            lng:11.5893659,
            query: "restaurant"
        })

        expect(res2.body).toEqual(
           searchRouteComplexResult)

            expect(Google.combinedSearch.mock.calls).toHaveLength(1)
        





       
      
    })
    // test("does not work for anon", async ()=>{
    //     const newPoi = {name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link:"blah@blah.de", address: "address1"}      
    //     try{
    //       await request(app).post("/pois/").set('authorization', "blah").send(newPoi)
    //     }
    //     catch(e){

    //         expect(e instanceof UnauthorizedError).toBeTruthy()
    //     }
    //     })
    //     test("does not work for dupes", async ()=>{
           
    //         const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
    //         const newPoi = {name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link:"blah@blah.de", address: "address1"}      
    //          const res3 = await request(app).post("/pois/").set('authorization', res1.body.token).send(newPoi)
    //         try{
    //         await request(app).post("/pois/").set('authorization', res1.body.token).send(newPoi)
    //         }
    //         catch(e){
    
    //             expect(e instanceof BadRequestError).toBeTruthy()
    //         }
    //         })
     })


     