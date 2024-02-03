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
      const res2 = await await request(app).get("/users/u1").set('authorization', res1.body.token)
      const newTour = {title: "LiveTour24", artist: "LiveArtist24", startdate: "1989-10-27", enddate: "1989-10-29", user_id: res2.body.id}      
       const res3 = await request(app).post("/tours/").set('authorization', res1.body.token).send(newTour)
       expect(res3.body).toEqual(
        {tour: {id: expect.any(Number),title: "LiveTour24", artist: "LiveArtist24", startdate: expect.any(String), enddate: expect.any(String), user_id: res2.body.id} }
    )
    })
    test("does not work for anon", async ()=>{
        try{
          await request(app).post("/tours/").set('authorization', "blah").send({title: "LiveTour24", artist: "LiveArtist24", startdate: "1989-10-27", enddate: "1989-10-29", user_id: 9839})
        }
        catch(e){

            expect(e instanceof UnauthorizedError).toBeTruthy()
        }
        })
        test("does not work for dupes", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const res2 = await await request(app).get("/users/u1").set('authorization', res1.body.token)
            const newTour = {title: "LiveTour24", artist: "LiveArtist24", startdate: "1989-10-27", enddate: "1989-10-29", user_id: res2.body.id}      
            await request(app).post("/tours/").set('authorization', res1.body.token).send(newTour)
            try{
                await request(app).post("/tours/").set('authorization', res1.body.token).send(newTour)
            }
            catch(e){
    
                expect(e instanceof BadRequestError).toBeTruthy()
            }
            })
     })


     describe("GET /", ()=>{
        test("works for admins", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
            const token = res1.body.token
            const res2= await request(app).get("/tours").set('authorization', token)
            expect(res2.body).toEqual({tours:
                [{artist: "artist2", enddate: "1989-10-12T00:00:00.000Z", id: expect.any(Number), startdate: "1989-10-10T00:00:00.000Z", title: "tour2", user_id: expect.any(Number)},
                 {artist: "artist1", enddate: "1989-10-27T00:00:00.000Z", id: expect.any(Number), startdate: "1989-10-20T00:00:00.000Z", title: "tour1", user_id: expect.any(Number)}]})
        })
        test("does not work for non admins", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const token = res1.body.token
            try{
            const res2= await request(app).get("/tours").set('authorization', token)}
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
         })

        })



    describe("GET /:tour_id", ()=>{
            test("works ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/users/u1").set('authorization', token)
                const tour_id = res2.body.tours[0].id
                const res3 = await request(app).get(`/tours/${tour_id}`).set('authorization', token)
                expect(res3.body).toEqual({
                    tour: {
                    artist: "artist2",
                    enddate: "1989-10-12T00:00:00.000Z",
                    startdate: "1989-10-10T00:00:00.000Z",
                    title: "tour2",
                    tourstops: [ {
                                city: "city1",
                                 date: "1989-10-11T00:00:00.000Z",
                                id: expect.any(Number),
                                 location_id: expect.any(Number),
                                 name: "Location1",
                                 tour_id: expect.any(Number)
                               },
                             ],
                  
                    user_id: expect.any(Number),
                           }
                }
                )
            })

            test("doesnt work with unknown tour_id ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                try{
                const res3 = await request(app).get(`/tours/29383929`).set('authorization', token)
                }
                catch(e){
                    expect(e instanceof NotFoundError).toBeTruthy()
                }
                
            })
            test("does not work for logged in users who are not owning the tour", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/users/u1").set('authorization', token)
                const tour_id = res2.body.tours[0].id
                const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                const token2 = res3.body.token
                try{
                    const res4 = await request(app).get(`/tours/${tour_id}`).set('authorization', token2)}
                catch(e){
                    expect(e instanceof UnauthorizedError).toBeTruthy()
                }
             })
    
            })


        describe("PATCH /:tour_id", ()=>{
                test("works ", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                    const token = res1.body.token
                    const res2= await request(app).get("/users/u1").set('authorization', token)
                    const tour_id = res2.body.tours[0].id
                    const res3 = await request(app).patch(`/tours/${tour_id}`).set('authorization', token).send({title: "LOLTour"})
                    expect(res3.body).toEqual({
                        tour: {
                        artist: "artist2",
                        enddate: expect.any(String),
                        startdate: expect.any(String),
                        title: "LOLTour",
                        user_id: expect.any(Number),
                               }
                    }
                    )
                })
    
                test("doesnt work with unknown tour_id ", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                    const token = res1.body.token
                    try{
                    const res3 = await request(app).patch(`/tours/29383929`).set('authorization', token).send({title: "LOL"})
                    }
                    catch(e){
                        expect(e instanceof NotFoundError).toBeTruthy()
                    }
                })

           
                test("does not work for logged in users who are not owning the tour", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                    const token = res1.body.token
                    const res2= await request(app).get("/users/u1").set('authorization', token)
                    const tour_id = res2.body.tours[0].id
                    const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                    const token2 = res3.body.token
                    try{
                        const res4 = await request(app).patch(`/tours/${tour_id}`).set('authorization', token2).send({title:"LOL"})}
                    catch(e){
                        expect(e instanceof UnauthorizedError).toBeTruthy()
                    }
                 })

                 test("does not work for anon", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                    const token = res1.body.token
                    const res2= await request(app).get("/users/u1").set('authorization', token)
                    const tour_id = res2.body.tours[0].id
                    try{
                        const res4 = await request(app).patch(`/tours/${tour_id}`).set('authorization', "blah").send({title:"LOL"})}
                    catch(e){
                        expect(e instanceof UnauthorizedError).toBeTruthy()
                    }
                 })
        
                })



describe("DELETE /:tour_id", ()=>{
            test("works ", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                    const token = res1.body.token
                    const res2= await request(app).get("/users/u1").set('authorization', token)
                    const tour_id = res2.body.tours[0].id
                    const res3 = await request(app).delete(`/tours/${tour_id}`).set('authorization', token)
                    expect(res3.body).toEqual({
                        deleted: `${tour_id}`  
                                   }
                        )
                    try{
                        await request(app).get(`/tours/${tour_id}`).set('authorization', token)
                    }
                    catch(e){
                        expect(e instanceof NotFoundError).toBeTruthy()
                    }
                    })
                
        
                    test("doesnt work with unknown tour_id ", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                        const token = res1.body.token
                        try{
                        const res3 = await request(app).delete(`/tours/29383929`).set('authorization', token).send({title: "LOL"})
                        }
                        catch(e){
                            expect(e instanceof NotFoundError).toBeTruthy()
                        }
                    })
    
               
                    test("does not work for logged in users who are not owning the tour", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                        const token = res1.body.token
                        const res2= await request(app).get("/users/u1").set('authorization', token)
                        const tour_id = res2.body.tours[0].id
                        const res3 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                        const token2 = res3.body.token
                        try{
                             await request(app).delete(`/tours/${tour_id}`).set('authorization', token2)}
                        catch(e){
                            expect(e instanceof UnauthorizedError).toBeTruthy()
                        }
                     })
    
                     test("does not work for anon", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                        const token = res1.body.token
                        const res2= await request(app).get("/users/u1").set('authorization', token)
                        const tour_id = res2.body.tours[0].id
                        try{
                            const res4 = await request(app).delete(`/tours/${tour_id}`).set('authorization', "blah")}
                        catch(e){
                            expect(e instanceof UnauthorizedError).toBeTruthy()
                        }
                     })
            
                    })
    
    