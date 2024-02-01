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
      const newPoi = {name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link:"blah@blah.de", address: "address1"}      
       const res3 = await request(app).post("/pois/").set('authorization', res1.body.token).send(newPoi)
       expect(res3.body).toEqual(
        {poi: 
            {id: expect.any(Number), name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link: "blah@blah.de", address: "address1"}      
         }
    )
    })
    test("does not work for anon", async ()=>{
        const newPoi = {name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link:"blah@blah.de", address: "address1"}      
        try{
          await request(app).post("/pois/").set('authorization', "blah").send(newPoi)
        }
        catch(e){

            expect(e instanceof UnauthorizedError).toBeTruthy()
        }
        })
        test("does not work for dupes", async ()=>{
           
            const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
            const newPoi = {name: "Restaurant1", category:"Restaurant", googleplaces_id: "abcde", googlemaps_link:"blah@blah.de", address: "address1"}      
             const res3 = await request(app).post("/pois/").set('authorization', res1.body.token).send(newPoi)
            try{
            await request(app).post("/pois/").set('authorization', res1.body.token).send(newPoi)
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
            const res2= await request(app).get("/pois").set('authorization', token)
            expect(res2.body).toEqual({pois:
                [{id: expect.any(Number), name: "poi1", category: "restaurant", googlemaps_link: "www.google.de", googleplaces_id: "abcd", address: "address1"},{id: expect.any(Number), name: "poi2", category: "restaurant", googlemaps_link: "www.google.de", googleplaces_id: "abcde", address: "address2"}]
        })
        })

        test("does not work for anon", async ()=>{
           try{
              await request(app).get("/pois/").set('authorization', "blah")
            }
            catch(e){
    
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })

    
      
        })



    describe("GET /:poi_id", ()=>{
            test("works ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/pois").set('authorization', token)
                const poi_id = res2.body.pois[0].id
                const res3 = await request(app).get(`/pois/${poi_id}`).set('authorization', token)
                expect(res3.body).toEqual({
                   poi: {id: expect.any(Number),name: "poi1", category: "restaurant", googlemaps_link: "www.google.de", googleplaces_id: "abcd", address: "address1"}
                }
                )
            })

            test("doesnt work with unknown poi_id ", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/pois").set('authorization', token)
                const poi_id = res2.body.pois[0].id
              
                try{
                    await request(app).get(`/pois/383838`).set('authorization', token)
                }
                catch(e){
                    expect(e instanceof NotFoundError).toBeTruthy()
                }
                
            })
            test("does not work for anon", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                const token = res1.body.token
                const res2= await request(app).get("/pois").set('authorization', token)
                const poi_id = res2.body.pois[0].id
              
                try{
                    await request(app).get(`/pois/${poi_id}`)
                }
                catch(e){
                    expect(e instanceof UnauthorizedError).toBeTruthy()
                }
             })
    
            })



       describe("PATCH /:username", ()=>{
        test("works", async ()=>{
          const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
          const token = res1.body.token
          const res2= await request(app).get("/pois").set('authorization', token)
          const poi_id = res2.body.pois[0].id
          const res3 = await request(app).patch(`/pois/${poi_id}`).set('authorization', token).send({name: "newPoi", address: "newAddress"})
           expect(res3.body).toEqual({updated:
            {id: expect.any(Number),name: "newPoi", category: "restaurant", googlemaps_link: "www.google.de", googleplaces_id: "abcd", address: "newAddress"}
        
            } )
        })
        test("does not work for anon", async ()=>{
            try{
                const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                const token = res1.body.token
                const res2= await request(app).get("/pois").set('authorization', token)
                const poi_id = res2.body.pois[0].id
              const res = await request(app).patch(`/pois/${poi_id}`).set('authorization', "blahblah").send({name: "lolpoi"})
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
  
       
              test("does not work with non valid schema", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                const token = res1.body.token
                const res2= await request(app).get("/pois").set('authorization', token)
                const poi_id = res2.body.pois[0].id
                try{
                    await request(app).patch(`/pois/${poi_id}`).set('authorization', token).send({names: "newPoi", address: "newAddress"})
                }
                catch(e){
                    expect(e instanceof BadRequestError).toBeTruthy()
                }
                })
         })


describe("DELETE /:poi_id", ()=>{
            test("works ", async ()=>{
                    const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                    const token = res1.body.token
                    const res2= await request(app).get("/pois").set('authorization', token)
                    const poi_id = res2.body.pois[0].id
                    const res3 = await request(app).delete(`/pois/${poi_id}`).set('authorization', token)
                    expect(res3.body).toEqual({
                        deleted: `${poi_id}`  
                                   }
                        )
                    try{
                        await request(app).get(`/poi/${poi_id}`).set('authorization', token)
                    }
                    catch(e){
                        expect(e instanceof NotFoundError).toBeTruthy()
                    }
                    })
                
        
                    test("doesnt work with unknown poi_id ", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                    const token = res1.body.token
                      try{
                            const res3 = await request(app).delete(`/pois/238888`).set('authorization', token)
                        }
                        catch(e){
                            expect(e instanceof NotFoundError).toBeTruthy()
                        }
                    })
    
               
                    test("does not work for non admins logged in users", async ()=>{
                        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
                        const token = res1.body.token
                        const res2= await request(app).get("/pois").set('authorization', token)
                        const poi_id = res2.body.pois[0].id
                        try{
                            const res3 = await request(app).delete(`/pois/${poi_id}`).set('authorization', token)}
                        catch(e){
                            expect(e instanceof UnauthorizedError).toBeTruthy()
                        }
                     })
    
                })
    
    