"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
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

    // test("doesnt work with wrong password", async function () {
    //     try{
    //     const result = await User.authenticate("u1", "password1asasas");
   
    //  }
    //  catch(e){
    //     expect(e instanceof UnauthorizedError).toBeTruthy()
    //  };
  
   
//   });
  
})
