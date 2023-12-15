const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {pool} = require("./config")
const app = express();

app.use(cors())
app.use(bodyParser.json());

  app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Insert user data into the database
      const insertQuery = 'INSERT INTO signup (username, email, password) VALUES ($1, $2, $3)';
      await pool.query(insertQuery, [username, email, password]);
  
      res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Error during signup' });
    }
  });
  
  // Fetch  countries
  app.get('/api/countries', async (req, res) => {
    try {
      const countries = await pool.query('SELECT * FROM country');
      res.json(countries.rows);
    } catch (err) {
      console.error('Error fetching countries:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/api/Users', async (req, res) => {
    try {
      const countries = await pool.query('SELECT * FROM voterlist');
      res.json(countries.rows);
    } catch (err) {
      console.error('Error fetching countries:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Fetch zones for a specific country
  app.get('/api/zones/:countryId', async (req, res) => {
    const { countryId } = req.params;
    try {
      const zones = await pool.query('SELECT * FROM zone WHERE country_id = $1', [countryId]);
      res.json(zones.rows);
    } catch (err) {
      console.error('Error fetching zones:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Fetch states for a specific zone
  app.get('/api/states/:zoneId', async (req, res) => {
    const { zoneId } = req.params;
    try {
      const states = await pool.query('SELECT * FROM state WHERE zone_id = $1', [zoneId]);
      res.json(states.rows);
    } catch (err) {
      console.error('Error fetching states:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Fetch regions for a specific state
  app.get('/api/regions/:stateId', async (req, res) => {
    const { stateId } = req.params;
    try {
      const regions = await pool.query('SELECT * FROM region WHERE state_id = $1', [stateId]);
      res.json(regions.rows);
    } catch (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Fetch mps for a specific regions
  app.get('/api/mps/:regionId', async (req, res) => {
    const { regionId } = req.params;
    try {
      const mps = await pool.query('SELECT * FROM mp WHERE region_id = $1', [regionId]);
      res.json(mps.rows);
    } catch (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Fetch assemblies for a specific mp
  app.get('/api/assemblies/:mpId', async (req, res) => {
    const { mpId } = req.params;
    try {
      const assemblys = await pool.query('SELECT * FROM assembly WHERE mp_id = $1', [mpId]);
      res.json(assemblys.rows);
    } catch (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Fetch mandals for a specific assemblies
  app.get('/api/mandals/:assemblyId', async (req, res) => {
    const { assemblyId } = req.params;
    try {
      const mandals = await pool.query('SELECT * FROM mandal WHERE assembly_id = $1', [assemblyId]);
      res.json(mandals.rows);
    } catch (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Fetch villages for a specific mandals
  app.get('/api/villages/:mandalId', async (req, res) => {
    const { mandalId } = req.params;
    try {
      const villages = await pool.query('SELECT * FROM village WHERE mandal_id = $1', [mandalId]);
      res.json(villages.rows);
    } catch (err) {
      console.error('Error fetching regions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});