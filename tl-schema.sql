
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  isAdmin BOOLEAN NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  image_url  TEXT
);

CREATE TABLE login (
    user_id INTEGER PRIMARY KEY REFERENCES users ON DELETE CASCADE,
    password TEXT NOT NULL
);

CREATE TABLE tours (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist VARCHAR(40) NOT NULL,
  startdate BIGINT NOT NULL,
  enddate BIGINT NOT NULL CHECK (startdate < enddate),
  user_id INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE

);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  country VARCHAR(60) NOT NULL,
  name TEXT UNIQUE NOT NULL,
  postal_code VARCHAR(25) NOT NULL,
  city VARCHAR(60) NOT NULL,
  street VARCHAR(60) NOT NULL,
  housenumber VARCHAR(10) NOT NULL,
  googleplaces_id TEXT NOT NULL,
  lat FLOAT(50) NOT NULL,
  lng FLOAT(50) NOT NULL
);

CREATE TABLE tourstops(
    id SERIAL PRIMARY KEY,
    location_id INTEGER 
        REFERENCES locations ON DELETE CASCADE,
    tour_id INTEGER 
        REFERENCES tours ON DELETE CASCADE,
    date BIGINT NOT NULL
);

CREATE TABLE pois(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category VARCHAR(25) NOT NULL,
    googlemaps_link TEXT NOT NULL,
    googleplaces_id TEXT NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    poi_id INTEGER
        REFERENCES pois ON DELETE CASCADE,
    tourstop_id INTEGER
        REFERENCES tourstops ON DELETE CASCADE,
    traveltime INTEGER NOT NULL,
    travelmode TEXT NOT NULL
);


CREATE TABLE crewmembers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);


CREATE TABLE tourcrews (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER
            REFERENCES crewmembers ON DELETE CASCADE,
    tour_id INTEGER
          REFERENCES tours ON DELETE CASCADE
);


CREATE TABLE locationnotes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER
            REFERENCES users ON DELETE CASCADE,
    location_id INTEGER
          REFERENCES locations ON DELETE CASCADE,
    note TEXT NOT NULL
);


CREATE TABLE poinotes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER
            REFERENCES users ON DELETE CASCADE,
    poi_id INTEGER
          REFERENCES pois ON DELETE CASCADE,
    note TEXT NOT NULL
);


