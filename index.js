const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URL).then(() => console.log("MONGO-DB Connected")).catch((e) => console.log(e));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        //check for existing user
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password

            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log("User already exist");
            express.redirect("/error")
        }


    } catch (error) {
        console.log(error);
        res.redirect("error");
    }
})
app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html")
});
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/error.html")
});

// Schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

// model of registration
const Registration = mongoose.model("registration", registrationSchema);

app.listen(port, () => {
    console.log(`Server is up on running ${port}`);
});



