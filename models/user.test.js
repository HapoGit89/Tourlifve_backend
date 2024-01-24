"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("register", function () {
  const newUser = {
    username: "Hapo",
    password: "password",
    email: "hannes@hannes.de",
    image_url: "test.de"
  };

  test("works", async function () {
     await User.register(newUser);
   
  
    const result = await User.get("Hapo");
    expect(result).toEqual(
        {
            username: "Hapo",
            email: "hannes@hannes.de",
            image_url: "test.de",
            tours: [],
            id: expect.any(Number)
          },
    );
  });

  test("bad request with dupe", async function () {
    try {
      await User.register(newUser);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


describe("authenticate", function () {
 
  
    test("works with valid password", async function () {
       const result = await User.authenticate("u1", "password1");
     
    
 
      expect(result).toEqual(
          {
              username: "u1",
              email: "u1@email.com",
              image_url: null,
              id: expect.any(Number),
              isAdmin: false
            },
      );
    });

    test("doesnt work with wrong password", async function () {
        try{
        const result = await User.authenticate("u1", "password1asasas");
   
     }
     catch(e){
        expect(e instanceof UnauthorizedError).toBeTruthy()
     };
  
   
  });
  
})


describe("get", function () {
 
  
    test("works with existing user", async function () {
       const result = await User.get("u1");
     
    
 
      expect(result).toEqual(
          {
              username: "u1",
              email: "u1@email.com",
              image_url: null,
              id: expect.any(Number),
              tours: [
                {artist: "artist2",
                title: "tour2",
                startdate: expect.any(Date),
                enddate: expect.any(Date),
                id: expect.any(Number) }
              
           ] },
      );
    });


    test("throws error with nonexisting user", async function () {
        try{
        const result = await User.get("u23090");}
        catch(e){
            expect(e.message).toEqual("No user: u23090")
            expect(e instanceof NotFoundError).toBeTruthy()
        }
      
     
  
  
     });

  
})


describe("findAll", function () {
 
  
    test("works", async function () {
       const result = await User.findAll();
     
    
 
      expect(result).toEqual(
        [
          {
              username: "u1",
              email: "u1@email.com",
              image_url: null },
           {
            username: "u2",
            email: "u2@email.com",
            image_url: null
          }],
      );
    });
  
})


describe("update", function () {
 
  
    test("works", async function () {
       const result = await User.update('u1', {email: "testy@test.de", image_url:"1@1.de"});
     
    
 
      expect(result).toEqual(
        
          {
              username: "u1",
              email: "testy@test.de",
              image_url: "1@1.de" },    
         
      );
    });


    test("doesn not work for unknown user", async function () {
        try{
        const result = await User.update('u4', {email: "testy@test.de", image_url:"1@1.de"});
        }
        catch(e){
            expect(e.message).toEqual("No user: u4")
            expect(e instanceof NotFoundError).toBeTruthy()
        }
     });

     test("doesn not work for bad request", async function () {
        try{
        const result = await User.update('u1', {email: "testy@test.de", password:"1@1.de"});
        }
        catch(e){
            
            expect(e.message).toEqual(`column "password" of relation "users" does not exist`)
        }
     });
  
  
})


describe("updatePassword", function () {
 
  
    test("works", async function () {
      
       const result = await User.updatePassword('u1', "password1", "testword");
       const result2 = await User.authenticate('u1', "testword")
     
    
 
      expect(result2).toEqual(
        {
            username: "u1",
            email: "u1@email.com",
            image_url: null,
            id: expect.any(Number),
            isAdmin: false
          }
      );
    });


    test("doesn not work for unknown user", async function () {
        try{
        const result = await User.updatePassword('u12', "testword", "testword2");
        }
        catch(e){
            expect(e.message).toEqual("No user: u12")
            expect(e instanceof NotFoundError).toBeTruthy()
        }
     });

     test("doesn not work for wrong old word", async function () {
        try{
            const result = await User.updatePassword('u1', "testword23233223", "testword2");
            }
            catch(e){
                expect(e.message).toEqual("Unauthorized")
                expect(e instanceof UnauthorizedError).toBeTruthy()
            }
     });
  
  
})
