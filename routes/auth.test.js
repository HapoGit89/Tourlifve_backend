process.env.NODE_ENV = "test"

const request = require ("supertest")
const app = require("../app")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon");
const { BadRequestError, UnauthorizedError } = require("../expressError");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

describe("POST /register", ()=>{
    test("works", async ()=>{
       const res = await request(app).post("/auth/register").send({username: "Hapo", password: "password", email: "test@test.de"})
       expect(res.body).toEqual({
        token: expect.any(String)
       })
    })
    test("does not work with wrong schema", async ()=>{
        try{
        const res = await request(app).post("/auth/register").send({usernames: "Hapo", password: "password", email: "test@test.de"})
        }
        catch(e){
            expect(e instanceof BadRequestError).toBeTruthy()
        }
        })
     })

     describe("POST /token", ()=>{
        test("works", async ()=>{
           const res = await request(app).post("/auth/register").send({username: "Hapo", password: "password", email: "test@test.de"})
            const res2 = await request(app).post("/auth/token").send({username: "Hapo", password:"password"})
            expect(res2.body).toEqual({
                token: expect.any(String)
            })
           })
        
        test("does not work with wrong credentials", async ()=>{
            const res = await request(app).post("/auth/register").send({usernames: "Hapo", password: "password", email: "test@test.de"})
            try{
                const res2 = await request(app).post("/auth/token").send({username: "Hapo", password:"password"})
            }
            catch(e){
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
            })
        })


        describe("PATCH /token", ()=>{
            test("works", async ()=>{
               const res = await request(app).post("/auth/register").send({username: "Hapo", password: "password", email: "test@test.de"})
                const res2 = await request(app).patch("/auth/token").send({username: "Hapo", password:"password", new_password: "password2"})
               const res3 = await request(app).post("/auth/token").send({username: "Hapo", password: "password2"})
               expect(res3.body).toEqual({
                token: expect.any(String)
               })
               })
            
            test("does not work with wrong credentials", async ()=>{
                const res = await request(app).post("/auth/register").send({usernames: "Hapo", password: "password", email: "test@test.de"})
                try{
                    const res2 = await request(app).patch("/auth/token").send({username: "Hapo", password:"password2323", new_password:"lol"})
                }
                catch(e){
                    expect(e instanceof UnauthorizedError).toBeTruthy()
                }
                })
                test("does not work with wrong json schema", async ()=>{
                    const res = await request(app).post("/auth/register").send({usernames: "Hapo", password: "password", email: "test@test.de"})
                    try{
                        const res2 = await request(app).patch("/auth/token").send({username: "Hapo", password:"password", lol: "lol", new_password:"lol"})
                    }
                    catch(e){
                        expect(e instanceof UnauthorizedError).toBeTruthy()
                    }
                    })
            })
    


    
         