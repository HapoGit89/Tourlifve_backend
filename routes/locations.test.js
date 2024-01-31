process.env.NODE_ENV = "test"

const request = require ("supertest")
const app = require("../app")

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
       
      const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
      const newLocation = {name: "Huxleys", country: "Germany", city: "Berlin", street: "Hasenheide 98", housenumber: "9", postal_code: "55435", googleplaces_id: "abcde", lat: 8.0, lng: 9.0}      
       const res3 = await request(app).post("/locations/").set('authorization', res1.body.token).send(newLocation)
       expect(res3.body).toEqual(
        {location: {
               city: "Berlin",
                country: "Germany",
                googleplaces_id: "abcde",
                housenumber: "9",
                 lat: 8,
                lng: 9,
                name: "Huxleys",
                 postal_code: "55435",
                 street: "Hasenheide 98",
                },
         }
    )
    })
    test("does not work for anon", async ()=>{
        try{
          await request(app).post("/locations/").set('authorization', "blah").send({name: "Huxleys", country: "Germany", city: "Berlin", street: "Hasenheide 98", housenumber: "9", postal_code: "55435", googleplaces_id: "abcde", lat: 8.0, lng: 9.0}   )
        }
        catch(e){

            expect(e instanceof UnauthorizedError).toBeTruthy()
        }
        })
        test("does not work for dupes", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const res2 = await await request(app).get("/users/u1").set('authorization', res1.body.token)
            const newLocation = {name: "Huxleys", country: "Germany", city: "Berlin", street: "Hasenheide 98", housenumber: "9", postal_code: "55435", googleplaces_id: "abcde", lat: 8.0, lng: 9.0}      
            const res3 = await request(app).post("/locations/").set('authorization', res1.body.token).send(newLocation)
            try{
            await request(app).post("/locations/").set('authorization', res1.body.token).send(newLocation)
            }
            catch(e){
    
                expect(e instanceof BadRequestError).toBeTruthy()
            }
            })
     })


     describe("GET /", ()=>{
        test("works for logged in users", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
            const token = res1.body.token
            const res2= await request(app).get("/locations").set('authorization', token)
            expect(res2.body).toEqual({locations:
                [{id: expect.any(Number),name: "Location1", country: "Country1", city: "city1", street: "street1", housenumber: "1", postal_code: "55434", googleplaces_id: "abcde", lat: 8.0, lng: 42.0},
                {id: expect.any(Number),name: "Location2", country: "Country2", city: "city2", street: "street2", housenumber: "2", postal_code: "55435", googleplaces_id: "abcde", lat: 9.0, lng: 42.0}      ]
        })
        })
        test("does not work for anon", async ()=>{
            
            try{
            const res2= await request(app).get("/locations").set('authorization', "blah")}
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
         })

        })



    describe("GET /:location_id", ()=>{
            test("works ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/locations").set('authorization', token)
                const location_id = res2.body.locations[0].id
                const res3 = await request(app).get(`/locations/${location_id}`).set('authorization', token)
                expect(res3.body).toEqual({
                   location: {name: "Location1", country: "Country1", city: "city1", street: "street1", housenumber: "1", postal_code: "55434", googleplaces_id: "abcde", lat: 8.0, lng: 42.0}
                }
                )
            })

            // test("doesnt work with unknown tour_id ", async ()=>{
            //     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            //     const token = res1.body.token
            //     try{
            //     const res3 = await request(app).get(`/tours/29383929`).set('authorization', token)
            //     }
            //     catch(e){
            //         expect(e instanceof NotFoundError).toBeTruthy()
            //     }
                
            // })
            // test("does not work for logged in users who are not owning the tour", async ()=>{
            //     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            //     const token = res1.body.token
            //     const res2= await request(app).get("/users/u1").set('authorization', token)
            //     const tour_id = res2.body.tours[0].id
            //     const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
            //     const token2 = res3.body.token
            //     try{
            //         const res4 = await request(app).get(`/tours/${tour_id}`).set('authorization', token2)}
            //     catch(e){
            //         expect(e instanceof UnauthorizedError).toBeTruthy()
            //     }
            //  })
    
            })


//         describe("PATCH /:tour_id", ()=>{
//                 test("works ", async ()=>{
//                     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                     const token = res1.body.token
//                     const res2= await request(app).get("/users/u1").set('authorization', token)
//                     const tour_id = res2.body.tours[0].id
//                     const res3 = await request(app).patch(`/tours/${tour_id}`).set('authorization', token).send({title: "LOLTour"})
//                     expect(res3.body).toEqual({
//                         tour: {
//                         artist: "artist2",
//                         enddate: expect.any(String),
//                         startdate: expect.any(String),
//                         title: "LOLTour",
//                         user_id: expect.any(Number),
//                                }
//                     }
//                     )
//                 })
    
//                 test("doesnt work with unknown tour_id ", async ()=>{
//                     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                     const token = res1.body.token
//                     try{
//                     const res3 = await request(app).patch(`/tours/29383929`).set('authorization', token).send({title: "LOL"})
//                     }
//                     catch(e){
//                         expect(e instanceof NotFoundError).toBeTruthy()
//                     }
//                 })

           
//                 test("does not work for logged in users who are not owning the tour", async ()=>{
//                     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                     const token = res1.body.token
//                     const res2= await request(app).get("/users/u1").set('authorization', token)
//                     const tour_id = res2.body.tours[0].id
//                     const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//                     const token2 = res3.body.token
//                     try{
//                         const res4 = await request(app).patch(`/tours/${tour_id}`).set('authorization', token2).send({title:"LOL"})}
//                     catch(e){
//                         expect(e instanceof UnauthorizedError).toBeTruthy()
//                     }
//                  })

//                  test("does not work for anon", async ()=>{
//                     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                     const token = res1.body.token
//                     const res2= await request(app).get("/users/u1").set('authorization', token)
//                     const tour_id = res2.body.tours[0].id
//                     try{
//                         const res4 = await request(app).patch(`/tours/${tour_id}`).set('authorization', "blah").send({title:"LOL"})}
//                     catch(e){
//                         expect(e instanceof UnauthorizedError).toBeTruthy()
//                     }
//                  })
        
//                 })



// describe("DELETE /:tour_id", ()=>{
//             test("works ", async ()=>{
//                     const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                     const token = res1.body.token
//                     const res2= await request(app).get("/users/u1").set('authorization', token)
//                     const tour_id = res2.body.tours[0].id
//                     const res3 = await request(app).delete(`/tours/${tour_id}`).set('authorization', token)
//                     expect(res3.body).toEqual({
//                         deleted: `${tour_id}`  
//                                    }
//                         )
//                     try{
//                         await request(app).get(`/tours/${tour_id}`).set('authorization', token)
//                     }
//                     catch(e){
//                         expect(e instanceof NotFoundError).toBeTruthy()
//                     }
//                     })
                
        
//                     test("doesnt work with unknown tour_id ", async ()=>{
//                         const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                         const token = res1.body.token
//                         try{
//                         const res3 = await request(app).delete(`/tours/29383929`).set('authorization', token).send({title: "LOL"})
//                         }
//                         catch(e){
//                             expect(e instanceof NotFoundError).toBeTruthy()
//                         }
//                     })
    
               
//                     test("does not work for logged in users who are not owning the tour", async ()=>{
//                         const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                         const token = res1.body.token
//                         const res2= await request(app).get("/users/u1").set('authorization', token)
//                         const tour_id = res2.body.tours[0].id
//                         const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
//                         const token2 = res3.body.token
//                         try{
//                              await request(app).delete(`/tours/${tour_id}`).set('authorization', token2)}
//                         catch(e){
//                             expect(e instanceof UnauthorizedError).toBeTruthy()
//                         }
//                      })
    
//                      test("does not work for anon", async ()=>{
//                         const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
//                         const token = res1.body.token
//                         const res2= await request(app).get("/users/u1").set('authorization', token)
//                         const tour_id = res2.body.tours[0].id
//                         try{
//                             const res4 = await request(app).delete(`/tours/${tour_id}`).set('authorization', "blah")}
//                         catch(e){
//                             expect(e instanceof UnauthorizedError).toBeTruthy()
//                         }
//                      })
            
//                     })
    
    