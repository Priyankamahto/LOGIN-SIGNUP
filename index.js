const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express ();
dotenv.config();

const port = process.env.PORT || 4000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(process.env.MONGOURI).then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

const registrationSchema = new mongoose.Schema({
    email : String,
    password : String,
    firstname : String,
    lastname : String,
});

const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res) =>{
    res.sendFile(__dirname + "/index1.html");
})

app.post("/register", async (req,res) => {
    try{
        const{email,password,firstname,lastname} = req.body;

        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
        const registrationData = new Registration({
            email,
            password,
            firstname,
            lastname,
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        console.log("these are already exist");
        res.redirect("/error");
    }}
    catch (error) {
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res) =>{
    res.sendFile(__dirname + "/success.html") ;
})
app.get("/error", (req,res) =>{
    res.sendFile(__dirname + "/error.html");
})


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})