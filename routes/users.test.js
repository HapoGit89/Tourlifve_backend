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

  // get a token 


  describe("GET /", ()=>{
    test("works", async ()=>{
      const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
       const res = await request(app).get("/users/").set('authorization', res1.body.token)
       expect(res.body).toEqual(
        [{email: "u1@email.com", image_url: null, username: "u1"}, {email: "u2@email.com", image_url: null, username: "u2"}]
    )
    })
    test("does not work for anon", async ()=>{
        try{
          const res = await request(app).get("/users/").set('authorization', "blah")
        }
        catch(e){
            expect(e instanceof UnauthorizedError).toBeTruthy()
        }
        })
     })

     describe("GET /:username", ()=>{
      test("works", async ()=>{
        const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
         const res = await request(app).get("/users/u1").set('authorization', res1.body.token)
         expect(res.body).toEqual(
          {id: expect.any(Number),email: "u1@email.com", image_url: null, username: "u1", tours: [
            {   
             artist: "artist2",
               enddate: "1989-10-12T00:00:00.000Z",
              id: expect.any(Number),
             startdate: "1989-10-10T00:00:00.000Z",
              title: "tour2",
             }
          ]}
      )
      })
      test("does not work for anon", async ()=>{
          try{
            const res = await request(app).get("/users/u1").set('authorization', "blahblah")
          }
          catch(e){
              expect(e instanceof UnauthorizedError).toBeTruthy()
          }
          })

          test("does not work for other logged in users", async ()=>{
            const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
            try{
              const res = await request(app).get("/users/u1").set('authorization', res1.body.token)
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
       })



       describe("PATCH /:username", ()=>{
        test("works", async ()=>{
          const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
           const res2 = await request(app).patch("/users/u1").set('authorization', res1.body.token).send({email:"lol@lol.de"})
           const res3 = await request(app).get("/users/u1").set('authorization', res1.body.token)
           expect(res3.body).toEqual(
            {id: expect.any(Number),email: "lol@lol.de", image_url: null, username: "u1", tours: [
              {   
               artist: "artist2",
                 enddate: "1989-10-12T00:00:00.000Z",
                id: expect.any(Number),
               startdate: "1989-10-10T00:00:00.000Z",
                title: "tour2",
               }
            ]}
        )
        })
        test("does not work for anon", async ()=>{
            try{
              const res = await request(app).patch("/users/u1").set('authorization', "blahblah").send({email: "lol@lol.de"})
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
  
            test("does not work for other logged in users", async ()=>{
              const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
              try{
                const res = await request(app).patch("/users/u1").set('authorization', res1.body.token).send({email:"lol"})
              }
              catch(e){
                  expect(e instanceof UnauthorizedError).toBeTruthy()
              }
              })
              test("does not work with non valid schema", async ()=>{
                const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
                try{
                  const res = await request(app).patch("/users/u1").set('authorization', res1.body.token).send({emailings:"lol"})
                }
                catch(e){
                    expect(e instanceof BadRequestError).toBeTruthy()
                }
                })
         })



       describe("DELETE /:username", ()=>{
        test("works", async ()=>{
          const res1 = await request(app).post("/auth/token").send({username:"u1", password: "password1"})
          await request(app).delete("/users/u1").set('authorization', res1.body.token)
           try{
           await request(app).get("/users/u1").set('authorization', res1.body.token)}
          catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
          }
        })
        test("does not work for anon", async ()=>{
            try{
              const res = await request(app).delete("/users/u2")
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
  
            test("does not work for other logged in users", async ()=>{
              const res1 = await request(app).post("/auth/token").send({username:"u2", password: "password2"})
              try{
                const res = await request(app).delete("/users/u1").set('authorization', res1.body.token)
              }
              catch(e){
                  expect(e instanceof UnauthorizedError).toBeTruthy()
              }
              })
         })
