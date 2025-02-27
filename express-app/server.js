const express = require('express'); //import express ls
const app = express(); //create an express js application
require("dotenv").config(); //import dotenve
const mongodb_connection = require('mongoose'); //import moongose
const User = require('./Models/User');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken')
const port_number = process.env.PORT || 5000; //define port number


//connect to database and catch errors
mongodb_connection.connect(process.env.MONGO_URI)
        .then(()=> console.log('MongoDB is Connected'))
        .catch(err => console.log('MongoDB Connection Error', err))


//Middlewares for JWT Authentication
//where the security is being used
const authentication = (req, res, next) =>{
    const authHeader = req.header["authorization"];
    if(!authHeader) return res.status(401).json({error: "Unauthorized - No Token Provided"});

    const token = authHeader.split(" ")[1]; //Extract the token from Bearer Token
    jwt.verify(token , process.env.JWT_SECRET, (err, user)=>{
        if(err) return res.status(403).ison({error: "Forbidden - Invalid Token"});
        req.user = user;
        next();
    });

};

app.use(express.json())//Parse JSON request
app.use(express.urlencoded({extended: true})) //Parses URL-encodend data

//custom made middleware
app.use((req, res, next) =>{
    console.log(`Request Received on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long'})}`);
    next(); //Pass control to next middleware
});


//Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PLP S-Hook: Express API Documentation',
      version: '1.0.0',
      description: 'A simple CRUD API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            },
        },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./server.js'], // File where Swagger documentation is written
};

//Initialize Swagger Configuration
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//REST API

//POST
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     security:
 *        - BearerAuth: []
 *     description: Adds a new user to the MongoDB database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized - Missing or Invalid Token
 *       400:
 *         description: Bad Request
 */
app.post("/users", async(req, res)=>{
    try{
        const newUser = new User(req.body); //extract json request from client and put in new user
        await newUser.save(); //ensures the user is saved before moving to next step
        res.status(201).json(newUser); //shows suser is saved
    }
    catch(error){
        res.status(400).json({error: "Bad Request "}); //when user is not saved
    }
});

//GET
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users from the Database
 *     security:
 *        - BearerAuth: []
 *     description: Fetch all users from the database.
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized - Missing or Invalid Token 
 *       500:
 *         description: Internal Server Error
 */
app.get("/users", async(req, res)=> {
    const users = await User.find(); //fetch from the database all users
    res.json(users); //respond pin json format
})

//UPDATE(PUT)
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     security:
 *        - BearerAuth: []
 *     description: Updates an existing user's details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - Missing or Invalid Token  
 *       404:
 *         description: User not found
 */
app.put("/users/:id", async(req, res) =>{
    //finds id and puts it in params, gets the whole body and updates it in the new section
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(user);
})

//DELETE
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     security:
 *        - BearerAuth: []
 *     description: Deletes a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - Missing or Invalid Token
 *       404:
 *         description: User not found
 */
app.delete("/users/:id", async(req, res) =>{
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
});



//making sure what you've imported works
//Static Routes
app.get('/about', (req, res)=>{
    res.send("Hello PLP S-Hook");
});

//Dynamic route
app.get('/users/:id',( req, res)=>{
    res.send(`User ID: ${req.params.id}`); //captures any value passed on id
});


//Start the server
app.listen(port_number, ()=>(
    console.log(`Server is running at http://localhost:${port_number}`),
    console.log(`Swagger API Docs is available at http://localhost:${port_number}/api-docs`)
));