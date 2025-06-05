Node.js NoCombo Application Deployment on AWS EC2
This guide explains how to deploy a Node.js application on an AWS EC2 instance and integrate it with MongoDB Atlas.

Prerequisites
AWS Account: Ensure you have an AWS account. If not, create one here.
Node.js Application: This guide assumes you have a Node.js application ready for deployment.
EC2 Instance: You should have an EC2 instance running Ubuntu 24.04 (or any other supported version).
MongoDB Atlas Account: Create a MongoDB Atlas account if you don't have one. Sign up here.
Step 1: Launch an EC2 Instance
Log in to AWS Management Console: Go to the EC2 Dashboard.
Launch Instance:
Click on “Launch Instance”.
Choose an Amazon Machine Image (AMI), such as “Ubuntu Server 24.04 LTS”.
Select an instance type (e.g., t2.micro for free tier).
Configure instance details and add storage as needed.
Add tags (optional) and configure security group rules to allow SSH (port 22) and HTTP (port 80) traffic.
Review and launch the instance. Download the key pair file (.pem) if you haven’t already.
Step 2: Connect to Your EC2 Instance
Open Terminal or Command Prompt:
Connect using SSH:
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
Step 3: Install Required Software
Update Packages:

sudo apt update
sudo apt upgrade
Install Node.js and npm:

sudo apt install nodejs npm
Install Git:

sudo apt install git
Step 4: Clone Your Node.js Application
Navigate to Your Home Directory:

cd ~
Clone Your GitHub Repository:

git clone https://github.com/your-username/your-repo.git
cd your-repo
Step 5: Set Up MongoDB Atlas
Create a MongoDB Atlas Account
Sign Up: Go to MongoDB Atlas and create an account if you don’t have one.
Create a New Cluster
Log in to MongoDB Atlas: After signing in, click on "Build a Cluster".
Select Cluster Tier: Choose a tier (e.g., free tier) and select your cloud provider and region.
Create Cluster: Click on "Create Cluster" and wait for the deployment to complete.
Configure Your Cluster
Whitelist Your IP Address:

Go to the "Network Access" tab.
Click "Add IP Address" and add your IP address or 0.0.0.0/0 to allow access from anywhere (for development purposes).
Create a Database User:

Go to the "Database Access" tab.
Click "Add New Database User".
Create a user with the necessary privileges and note the username and password.
Get Connection String
Get Connection String:
Go to the "Clusters" tab.
Click "Connect" on your cluster.
Choose "Connect your application" and copy the connection string.
Step 6: Integrate MongoDB Atlas with Your Node.js Application
Update Environment Variables:

Create a .env file in your project root if it doesn't exist.
Add the MongoDB Atlas connection string to .env:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=3000
Update Application Code:

Ensure your app.js is configured to use the MongoDB Atlas connection string:
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use environment variable for MongoDB connection string
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { codes: [], username: '' });
});

app.post('/generate', async (req, res) => {
  const length = parseInt(req.body.length);
  const combinations = parseInt(req.body.combinations);
  const username = req.body.username;

  const codes = [];
  for (let i = 0; i < combinations; i++) {
    // Generate numeric codes
    let code = '';
    for (let j = 0; j < length; j++) {
      code += Math.floor(Math.random() * 10); // Generate a digit (0-9)
    }
    codes.push(code);
  }

  // Check if user already exists in the database
  let user = await User.findOne({ username });

  if (user) {
    // If the user exists, add the new codes to their existing codes
    user.codes.push(...codes);
  } else {
    // If the user doesn't exist, create a new user
    user = new User({ username, codes });
  }

  // Save the user document
  await user.save();

  res.render('index', { codes, username });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
Step 7: Start Your Node.js Application
Run Your Application:

npm start
Access Your Application: Open a web browser and navigate to http://<your-ec2-public-ip>:3000 to see your running application.

Conclusion
You’ve successfully deployed your Node.js application on AWS EC2 and integrated it with MongoDB Atlas. Your application should now be running and connected to a cloud-based MongoDB database.

For more information, refer to the AWS EC2 Documentation and MongoDB Atlas Documentation.
