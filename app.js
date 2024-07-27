const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = 3500;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jasonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/cae52d9af0"

    const options = {
        method: "POST",
        headers: {
            Authorization: "auth 40a48f26fd55a651224196083685aaaa-us17"
        }
    };

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jasonData);
    request.end();

});

app.post("/failure.html", (req, res) => {
    res.redirect("/");
})

app.listen(port, () => {
    console.log("App is running on port 3500");
});




// API Key
// 40a48f26fd55a651224196083685aaaa-us17


// Unique ID
// cae52d9af0
// 4ec7cd1e7b