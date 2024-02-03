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
       
      const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
      const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
      const tour_id=(res2.body.tours[0].id)
      const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
      const location_id = res3.body.locations[0].id
      const res4 = await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
       expect(res4.body).toEqual(
         
            {tourstop: {id: expect.any(Number), tour_id:tour_id, location_id:location_id, date: expect.any(String)}}      
         
    )
    })
    test("does not work for anon", async ()=>{
        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
      const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
      const tour_id=(res2.body.tours[0].id)
      const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
      const location_id = res3.body.locations[0].id
        try{
            await request(app).post("/tourstops").set('authorization', "blah").send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
        }
        catch(e){

            expect(e instanceof UnauthorizedError).toBeTruthy()
        }
        })

     })


     describe("GET /tourstop_id", ()=>{
        test("works for logged in users", async ()=>{
      const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
      const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
      const tour_id=(res2.body.tours[0].id)
      const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
      const location_id = res3.body.locations[0].id
      const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
      const res5 = await request(app).get(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token)
       expect(res5.body).toEqual(
         
            {tourstop: {activities: expect.any(Array), name: "Location1", street: "street1", country: "Country1", housenumber: "1", googleplaces_id: expect.any(String),city:"city1",id: expect.any(Number), tour_id:tour_id, location_id:location_id, date: expect.any(String)}}      
         
    )
    })
        })

        // test("does not work for anon", async ()=>{
        //    try{
        //       await request(app).get("/pois/").set('authorization', "blah")
        //     }
        //     catch(e){
    
        //         expect(e instanceof UnauthorizedError).toBeTruthy()
        //     }
        //     })

    
      
    




       describe("PATCH /:tourstop_id", ()=>{
        test("works", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
            const tour_id=(res2.body.tours[0].id)
            const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
            const location_id = res3.body.locations[0].id
            const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
           const res5 = await request(app).patch(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token).send({ date: "1989-10-13"})
            expect(res5.body).toEqual({updated:
            {id: res4.body.tourstop.id,date: `${unix.fromDate("1989-10-13")}`, location_id:location_id, tour_id: tour_id}
        
            } )
        })
        test("does not work for anon", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
            const tour_id=(res2.body.tours[0].id)
            const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
            const location_id = res3.body.locations[0].id
            const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
            try
            {
                const res5 = await request(app).patch(`/tourstops/${res4.body.tourstop.id}`).set('authorization', "blah").send({ date: "1989-10-13"})
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
  
       
              test("does not work with non valid schema", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
            const tour_id=(res2.body.tours[0].id)
            const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
            const location_id = res3.body.locations[0].id
            const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
            try
            {
                const res5 = await request(app).patch(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token).send({ dates: "1989-10-13"})
            }
            catch(e){
                expect(e instanceof BadRequestError).toBeTruthy()
            }
                })
         })


describe("DELETE /:tourstop_id", ()=>{
            test("works ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
                const tour_id=(res2.body.tours[0].id)
                const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
                const location_id = res3.body.locations[0].id
                const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
                const res5 = await request(app).get(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token)
                expect(res5.body).toEqual(
                    {tourstop: {activities: expect.any(Array), name: "Location1", street: "street1", country: "Country1", housenumber: "1", googleplaces_id: expect.any(String),city:"city1",id: expect.any(Number), tour_id:tour_id, location_id:location_id, date: expect.any(String)}}      
                )
                    const res6 = await request(app).delete(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token).send({ date: "1989-10-13"}) 
                    try{
                        await request(app).get(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token)
                    }
                    catch(e){
                        expect(e instanceof NotFoundError).toBeTruthy()
                    }
                    })
                
        
                    test("doesnt work with unknown poi_id ", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                            try{
                                await request(app).delete(`/tourstops/999282`).set('authorization', res1.body.token)
                            }
                            catch(e){
                                expect(e instanceof NotFoundError).toBeTruthy()
                            }
                    })

                    test("doesnt not work for anon ", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                        const res2 = await request(app).get("/users/u1").set('authorization', res1.body.token)
                        const tour_id=(res2.body.tours[0].id)
                        const res3 = await request(app).get("/locations").set('authorization', res1.body.token)
                        const location_id = res3.body.locations[0].id
                        const res4 =await request(app).post("/tourstops").set('authorization', res1.body.token).send({tour_id: tour_id, location_id:location_id, date: "1989-10-12"})
                        const res5 = await request(app).get(`/tourstops/${res4.body.tourstop.id}`).set('authorization', res1.body.token)
                        expect(res5.body).toEqual(
                            {tourstop: {activities: expect.any(Array), name: "Location1", street: "street1", country: "Country1", housenumber: "1", googleplaces_id: expect.any(String),city:"city1",id: expect.any(Number), tour_id:tour_id, location_id:location_id, date: expect.any(String)}}      
                        )
                            
                            try{
                                await request(app).delete(`/tourstops/${res4.body.tourstop.id}`).set('authorization', "blah").send({ date: "1989-10-13"}) 
                            }
                            catch(e){
                                expect(e instanceof BadRequestError).toBeTruthy()
                            }
                    })
    
    
    
                })
    
    