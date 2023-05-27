const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {

    const fullName = req.body.fullName;
    const email = req.body.email;

    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FLNAME: fullName
        },
    }

    const jsonData = JSON.stringify(data);
    const url = 'https://us21.api.mailchimp.com/3.0/lists/10f4173489/members'
    const options = {
        method: 'POST',
        auth: "sukhfx:fe34c82a39be593f05ee703dd0bb000e-us21"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });

        // console.log(response.readable);

        if(response.statusCode == 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }
    });
    
    request.write(jsonData);
    request.end();

});

app.post('/failure', (req, res)=> {
    res.redirect('/');
});
app.post('/success', (req, res)=> {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port: 127.0.0.1:3000");
})


// key = fe34c82a39be593f05ee703dd0bb000e-us21
// listID = 10f4173489