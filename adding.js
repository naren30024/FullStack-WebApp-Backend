const { Client } = require('pg');

// Configuration for PostgreSQL connection
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432, // Default PostgreSQL port
});

client.connect();

// Sample data to be inserted
const voterListData = [
    { 
      "zone_id":1,
      "name": "Alice",
      "age": 30,
      "gender": "Female",
      "caste": "General",
      "religion": "Christian",
      "education": "Graduate",
      "employment": "Employed",
      "voter_id": "ABC1234567",
      "booth_no": "Booth 1",
      "pre_voting_date": "2022-05-15",
      "pre_vote_to": "Candidate X",
      "membership": "None",
      "affiliation": "None",
      "influence_factor": "Low",
      "father_name": "John"
    },
    {
      "zone_id":1,
      "name": "Bob",
      "age": 28,
      "gender": "Male",
      "caste": "OBC",
      "religion": "Hindu",
      "education": "Postgraduate",
      "employment": "Unemployed",
      "voter_id": "DEF9876543",
      "booth_no": "Booth 2",
      "pre_voting_date": "2022-04-20",
      "pre_vote_to": "Candidate Y",
      "membership": "Political Party A",
      "affiliation": "Youth Wing",
      "influence_factor": "Moderate",
      "father_name": "David"
    },
    {
      "zone_id":1,
      "name": "Charlie",
      "age": 35,
      "gender": "Male",
      "caste": "SC",
      "religion": "Buddhist",
      "education": "High School",
      "employment": "Self-employed",
      "voter_id": "GHI4567890",
      "booth_no": "Booth 3",
      "pre_voting_date": "2022-06-05",
      "pre_vote_to": "Candidate Z",
      "membership": "Trade Union",
      "affiliation": "Secretary",
      "influence_factor": "High",
      "father_name": "Ethan"
    },
    {
      "zone_id":2,
      "name": "Diana",
      "age": 25,
      "gender": "Female",
      "caste": "ST",
      "religion": "Hindu",
      "education": "Diploma",
      "employment": "Student",
      "voter_id": "JKL0123456",
      "booth_no": "Booth 4",
      "pre_voting_date": "2022-03-10",
      "pre_vote_to": "Candidate X",
      "membership": "Social Organization",
      "affiliation": "Member",
      "influence_factor": "Low",
      "father_name": "Frank"
    },
    {
      "zone_id":2,
      "name": "Eva",
      "age": 40,
      "gender": "Female",
      "caste": "General",
      "religion": "Muslim",
      "education": "Doctorate",
      "employment": "Doctor",
      "voter_id": "MNO5432109",
      "booth_no": "Booth 5",
      "pre_voting_date": "2022-07-18",
      "pre_vote_to": "Candidate Y",
      "membership": "Religious Association",
      "affiliation": "Leader",
      "influence_factor": "High",
      "father_name": "George"
    }
  ];

// Function to insert voter list data into the database
async function insertData() {
  try {
    for (const voter of voterListData) {
      const query = `
        INSERT INTO voterlist (name, age, gender, caste, religion, education, employment, voter_id, booth_no, pre_voting_date, pre_vote_to, membership, affiliation, influence_factor, father_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;

      const values = [
        voter.name,
        voter.age,
        voter.gender,
        voter.caste,
        voter.religion,
        voter.education,
        voter.employment,
        voter.voter_id,
        voter.booth_no,
        voter.pre_voting_date,
        voter.pre_vote_to,
        voter.membership,
        voter.affiliation,
        voter.influence_factor,
        voter.father_name,
      ];

      await client.query(query, values);
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    client.end();
  }
}

// Call the function to insert data
insertData();
