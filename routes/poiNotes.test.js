process.env.NODE_ENV = "test"

const request = require ("supertest")
const app = require("../app")
const unix = require("unix-timestamp")

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




  describe("POST /", ()=>{
    test("works", async ()=>{
       
        const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
        const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
        const user_id = res2.body.id
        const res3 = await request(app).get(`/pois`).set('authorization', res1.body.token)
        const poi_id = res3.body.pois[0].id
       const res4 = await request(app).post("/poinotes").set('authorization', res1.body.token).send({poi_id: poi_id, note: "Great Place"})
       expect(res4.body).toEqual(
         
            {poiNote: {id: expect.any(Number), poi_id: poi_id, user_id: user_id, note: "Great Place"}}
    )
    })
    // test("does not work for anon", async ()=>{   
    //     const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
    //     const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
    //     const tour_id=(res2.body.tours[0].id)
    //     const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
    //     const tourstop_id = res3.body.tour.tourstops[0].id
    //     const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
    //     const poi_id = res4.body.pois[0].id
    //     try{
    //     const res5 = await request(app).post("/activities").set('authorization', "blah").send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
    //     }
    //     catch(e){
    //         expect ( e instanceof UnauthorizedError).toBeTruthy()

    //     }
    //     })

    //     test("does not work for wrong schema", async ()=>{   
    //         const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
    //         const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
    //         const tour_id=(res2.body.tours[0].id)
    //         const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
    //         const tourstop_id = res3.body.tour.tourstops[0].id
    //         const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
    //         const poi_id = res4.body.pois[0].id
    //         try{
    //         const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id,lol:"lol", poi_id: poi_id, traveltime: 200, travelmode: "walking"})
    //         }
    //         catch(e){
    //             expect ( e instanceof BadRequestError).toBeTruthy()
    
    //         }
    //         })

    //         test("does not work for unknown poi_id", async ()=>{   
    //             const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
    //             const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
    //             const tour_id=(res2.body.tours[0].id)
    //             const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
    //             const tourstop_id = res3.body.tour.tourstops[0].id
    //             const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
    //             const poi_id = res4.body.pois[0].id
    //             try{
    //             const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: 9993838, traveltime: 200, travelmode: "walking"})
    //             }
    //             catch(e){
    //                 expect ( e instanceof BadRequestError).toBeTruthy()
        
    //             }
    //             })

     })


//      describe("GET /activity_id", ()=>{

        
//         test("works for logged in users", async ()=>{
//             const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//             const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
//             const tour_id=(res2.body.tours[0].id)
//             const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
//             const tourstop_id = res3.body.tour.tourstops[0].id
//             const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
//             const poi_id = res4.body.pois[0].id
//             const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
//             const res6 = await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//             expect(res6.body).toEqual(
             
//             {
//                 activity: {
//                   id: expect.any(Number),
//                   tourstop_id: expect.any(Number),
//                   poi_id: expect.any(Number),
//                   poi_name: 'poi1',
//                   poi_category: 'restaurant',
//                   poi_googlemaps_link: 'www.google.de',
//                   poi_googleplaces_id: 'abcd',
//                   poi_address: 'address1',
//                   traveltime: 200,
//                   travelmode: 'walking',
//                   location: { name: 'Location2', googleplaces_id: 'abcde', city: 'city2' }
//                 }
//               }
          
//         )
//     })

//     test("does not work for anon", async ()=>{
//         const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//         const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
//         const tour_id=(res2.body.tours[0].id)
//         const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
//         const tourstop_id = res3.body.tour.tourstops[0].id
//         const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
//         const poi_id = res4.body.pois[0].id
//         const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
//         const res6 = await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//        try{
//             await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', "blah")
//         }
//         catch(e){

//             expect(e instanceof UnauthorizedError).toBeTruthy()
//         }
//         })


//         test("does not work for unknown acitivity_id", async ()=>{
//             const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//             const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
//             const tour_id=(res2.body.tours[0].id)
//             const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
//             const tourstop_id = res3.body.tour.tourstops[0].id
//             const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
//             const poi_id = res4.body.pois[0].id
//             const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
//             const res6 = await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//            try{
//                 await request(app).get(`/activities/8388499`).set('authorization', res1.body.token)
//             }
//             catch(e){
    
//                 expect(e instanceof BadRequestError).toBeTruthy()
//             }
//             })

//         })

     

    
    
// describe("DELETE /:activity_id", ()=>{
//             test("works ", async ()=>{
//                 const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//                 const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
//                 const tour_id=(res2.body.tours[0].id)
//                 const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
//                 const tourstop_id = res3.body.tour.tourstops[0].id
//                 const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
//                 const poi_id = res4.body.pois[0].id
//                 const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
//                 const res6 = await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//                 expect(res6.body).toEqual(
//                     {
//                         activity: {
//                           id: expect.any(Number),
//                           tourstop_id: expect.any(Number),
//                           poi_id: expect.any(Number),
//                           poi_name: 'poi1',
//                           poi_category: 'restaurant',
//                           poi_googlemaps_link: 'www.google.de',
//                           poi_googleplaces_id: 'abcd',
//                           poi_address: 'address1',
//                           traveltime: 200,
//                           travelmode: 'walking',
//                           location: { name: 'Location2', googleplaces_id: 'abcde', city: 'city2' }
//                         }
//                       }
//                 )
//                     const res7 = await request(app).delete(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//                     try{
//                         await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//                     }
//                     catch(e){
//                         expect(e instanceof NotFoundError).toBeTruthy()
//                     }
//                     })
                
        
//                     test("doesnt work with unknown activity_id ", async ()=>{
//                         const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                             try{
//                                 await request(app).delete(`/activities/36464777`).set('authorization', res1.body.token)
//                             }
//                             catch(e){
//                                 expect(e instanceof NotFoundError).toBeTruthy()
//                             }
//                     })

//                     test("doesnt not work for anon ", async ()=>{
//                         const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//                         const res2 = await request(app).get("/users/u2").set('authorization', res1.body.token)
//                         const tour_id=(res2.body.tours[0].id)
//                         const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', res1.body.token)
//                         const tourstop_id = res3.body.tour.tourstops[0].id
//                         const res4 = await request(app).get("/pois").set('authorization', res1.body.token)
//                         const poi_id = res4.body.pois[0].id
//                         const res5 = await request(app).post("/activities").set('authorization', res1.body.token).send({tourstop_id: tourstop_id, poi_id: poi_id, traveltime: 200, travelmode: "walking"})
//                         const res6 = await request(app).get(`/activities/${res5.body.activity.id}`).set('authorization', res1.body.token)
//                         expect(res6.body).toEqual(
//                             {
//                                 activity: {
//                                   id: expect.any(Number),
//                                   tourstop_id: expect.any(Number),
//                                   poi_id: expect.any(Number),
//                                   poi_name: 'poi1',
//                                   poi_category: 'restaurant',
//                                   poi_googlemaps_link: 'www.google.de',
//                                   poi_googleplaces_id: 'abcd',
//                                   poi_address: 'address1',
//                                   traveltime: 200,
//                                   travelmode: 'walking',
//                                   location: { name: 'Location2', googleplaces_id: 'abcde', city: 'city2' }
//                                 }
//                               }
//                         )
                             
//                             try{
//                                 const res7 = await request(app).delete(`/activities/${res5.body.activity.id}`)
//                             }
//                             catch(e){
//                                 expect(e instanceof UnauthorizedError).toBeTruthy()
//                             }
//                     })
    
    
    
//                 })
    
    