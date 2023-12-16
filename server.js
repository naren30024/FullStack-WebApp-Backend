const express = require('express');
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const cors = require('cors');
const bodyParser = require('body-parser');
const {pool} = require("./config")
const app = express();

app.use(cors())
app.use(bodyParser.json());

  app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const userAvailble =  await pool.query('SELECT * FROM signup WHERE email = $1', [email]);
    if(userAvailble.rows.length > 0){
        res.json({status:200,message:"email already exist"});
    }
    else{
        try {
            //Hash password
            const hashedPassword = await bcrypt.hash(password,10);
            // Insert user data into the database
            const insertQuery = 'INSERT INTO signup (username, email, password) VALUES ($1, $2, $3)';
            await pool.query(insertQuery, [username, email, hashedPassword]);
        
            res.status(201).json({status:201, message: 'User signed up successfully',"rows":userAvailble.rows });
          } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ message: 'Error during signup' });
          }

    }
  
   
  });
  app.post('/api/login', async (req,res) => {
    const {email, password} = req.body;
    const insertQuery = await pool.query('SELECT *  from signup where email=$1', [email]);
    if(insertQuery.rows.length > 0 && (await bcrypt.compare(password,insertQuery.rows[0].password)) ){
        try {
            // Insert user data into the database
            // 'SELECT *  from signup where email=$1 and password=$2';
            const accesstoken = jwt.sign({
                user:{
                    username:insertQuery.rows.username,
                    email:insertQuery.rows.email,
                    id:insertQuery.rows.id,
                },
            },process.env.ACCESS_TOKEN_SECERT,
            {expiresIn:"1000m"})
            res.status(201).json({status:200,"acesstoken":accesstoken});
          } catch (error) {
            console.error('Error during logi:', error);
            res.status(500).json({ message: 'Error during login' });
          }
    }else{
        res.json({status:400,message:'invalid user'})
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
   
  // add users / insert users
  app.post('/api/users', async (req, res) => {
    const {regionId,name,age,gender,caste,religion,education,employement,voterId,
    boothNo,preVotingDate,preVoteTo,membership,affiliation,influenceFactor,fatherName} = req.body;
    try{
        const insertQuery = 'INSERT INTO voterlist (region_id,name,age,gender,caste,religion,education,employement,voter_id,booth_no,pre_voting_date,pre_vote_to,membership,affiliation,influence_factor,father_name) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)';
        await pool.query(insertQuery, [regionId, name, age,gender,caste,religion,education,employement,voterId,boothNo,preVotingDate,preVoteTo,membership,affiliation,influenceFactor,fatherName]);
        res.status(201).json({status:201, message: 'User added successfully successfully' });
        } catch (error) {
         console.error('Error during insert:', error);
            res.status(500).json({ message: 'Error during insert'});
          }
        })
  // update uses
  app.post('/api/users/update', async (req, res) => {
    const {id,regionId,name,age,gender,caste,religion,education,employement,voterId,
    boothNo,preVotingDate,preVoteTo,membership,affiliation,influenceFactor,fatherName} = req.body;
    try{
        const updatetQuery = 'UPDATE voterlist SET region_id = $1, name = $2,age = $3,gender = $4,caste = $5,religion = $6,education = $7,employement=$8,voter_id=$9,booth_no=$10,pre_voting_date=$11,pre_vote_to=$12,membership=$13,affiliation=$14,influence_factor=$15,father_name=$16 WHERE id = $17';
        await pool.query(updatetQuery, [regionId, name, age,gender,caste,religion,education,employement,voterId,boothNo,preVotingDate,preVoteTo,membership,affiliation,influenceFactor,fatherName,id]);
        res.status(201).json({status:201, message: 'User changed successfully' });
        } catch (error) {
         console.error('Error during insert:', error);
            res.status(500).json({ message: 'Error during changing'});
          }
        })
  //Fetch Users
  app.get('/api/users/:regionId', async (req, res) => {
    const { regionId } = req.params;
    try {
      const users = await pool.query('SELECT * FROM voterlist WHERE region_id =$1', [regionId]);
      res.json(users.rows);
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
  // Fetch all regions
  app.get('/api/regions', async (req, res) => {
    try {
      const regions = await pool.query('SELECT * FROM region');
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
  
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});