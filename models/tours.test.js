"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require("../expressError");
const Tour = require("./tours.js");
const User = require("./user.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const unix = require("unix-timestamp")

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


//************************************ */


describe("createTour", function () {

  
    test("works", async function () {
        const user = await User.get('u1')

        const newTour = {
            title: "LiveTour",
            artist: "Artist1",
            startdate: "1989-01-01",
            enddate:"1989-01-10",
            user_id: user.id
          };
     
    
      const result = await Tour.createTour(newTour);
      expect(result).toEqual(
        {   id: expect.any(Number),
            title: "LiveTour",
            artist: "Artist1",
            startdate: expect.any(String),
            enddate: expect.any(String),
            user_id: user.id
          },
      );

      const result2 = await Tour.get(result.id)

      expect(result2).toEqual(  {
        title: "LiveTour",
        artist: "Artist1",
        startdate: expect.any(Date),
        enddate: expect.any(Date),
        user_id: user.id
      },)
    });
  
    test("bad request with dupe", async function () {
      try {
        const user = await User.get('u1')

        const newTour = {
            title: "LiveTour",
            artist: "Artist1",
            startdate: "1989-01-01",
            enddate:"1989-01-10",
            user_id: user.id
          };
        await Tour.createTour(newTour);
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });
  });

  describe("findAll", function () {

  
    test("works", async function () {
        const tours = await Tour.findAll()

      expect(tours).toEqual([
        {   id: expect.any(Number),
            title: "tour2",
            artist: "artist2",
            startdate: expect.any(Date),
            enddate: expect.any(Date),
            user_id: expect.any(Number)
          },
          {   id: expect.any(Number),
            title: "tour1",
            artist: "artist1",
            startdate: expect.any(Date),
            enddate: expect.any(Date),
            user_id: expect.any(Number)
          }]
      );

    })
})

describe("get", function () {

  
    test("works", async function () {
        const tours = await Tour.findAll()
        const id = tours[0].id
        const tour = await Tour.get(id)

      expect(tour).toEqual(
        { 
            title: "tour2",
            artist: "artist2",
            startdate: expect.any(Date),
            enddate: expect.any(Date),
            user_id: expect.any(Number)}
        
      );

    })

    test("doesnt work with unknown id", async function () {
        try {
            const tour = await Tour.get(1298928)
        }
        catch(e){
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })
})



describe("update", function () {

  
  test("works", async function () {
      const tours = await Tour.findAll()
      const id = tours[0].id
     const tour = await Tour.update(id, {title: "updated_tour"})

    expect(tour).toEqual(
      { 
          title: "updated_tour",
          artist: tours[0].artist,
          startdate: expect.any(String),
          enddate: expect.any(String),
          user_id: tours[0].user_id}
      
    );

  })

  test("doesnt work with unknown id", async function () {
      try {
          const tour = await Tour.update(1298, {title: "updated_tour"})
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
  })

  
})



describe("delete", function () {

  
  test("works", async function () {
      const tours = await Tour.findAll()
      const id = tours[0].id
     const tour = await Tour.remove(id)
     try {
     const toursearch = await Tour.get(id)}
     catch (e){
      expect(e instanceof NotFoundError).toBeTruthy()
     }


  })

  test("doesnt work with unknown id", async function () {
      try {
          const tour = await Tour.remove(1298)
      }
      catch(e){
          expect(e instanceof NotFoundError).toBeTruthy()
      }
  })

  
})