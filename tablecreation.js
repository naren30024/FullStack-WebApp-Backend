const {pool} = require("./config")
async function createTables() {
    try {
      const client = await pool.connect();
      await client.query(`
      CREATE TABLE country (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
       );

      CREATE TABLE zone (
        id SERIAL PRIMARY KEY,
        country_id INTEGER REFERENCES country(id),
        name VARCHAR(100)
       );

       CREATE TABLE state (
        id SERIAL PRIMARY KEY,
        zone_id INTEGER REFERENCES zone(id),
        name VARCHAR(100)
       );

       CREATE TABLE region (
        id SERIAL PRIMARY KEY,
        state_id INTEGER REFERENCES state(id),
        name VARCHAR(100)
       );

       CREATE TABLE mp (
        id SERIAL PRIMARY KEY,
        region_id INTEGER REFERENCES region(id),
        name VARCHAR(100)
       );
       CREATE TABLE assembly (
        id SERIAL PRIMARY KEY,
        mp_id INTEGER REFERENCES mp(id),
        name VARCHAR(100)
       );
       CREATE TABLE mandal (
        id SERIAL PRIMARY KEY,
        assembly_id INTEGER REFERENCES assembly(id),
        name VARCHAR(100)
       );
       CREATE TABLE village (
        id SERIAL PRIMARY KEY,
        mandal INTEGER REFERENCES mandal(id),
        name VARCHAR(100)
       );
  
        
        
      `);
      client.release();
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }
  
  // Check database connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database. Current time:', res.rows[0].now);
      // Call the function to create tables after successful connection
      createTables();
    }
  });
  module.exports = {createTables}