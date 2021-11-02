require('dotenv').config();

// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const email = process.env.email;
const superSecretPwd = process.env.superSecretPwd;
const tokenFb = process.env.tokenAccesoFB

// Create an instance of the express app.
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Redirect to https://xyncs.com
// const targetBaseUrl = 'https://www.baaliacademy.com.mx/inicio';



// Routes
app.get('/', function (req, res) {
    // res.redirect(targetBaseUrl);
    res.render('inicio')

});
app.get('/:params?', function (req, res) {
    var params = req.params.params;
    res.render(params);
})

// Nodemailer route

app.post("/ajax/email", function (request, response) {
    console.log(email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: email,
            pass: superSecretPwd
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var textBody = `FROM: ${request.body.name}; EMAIL: ${request.body.email}; MESSAGE: ${request.body.message}`;
    var htmlBody = `<h2>Correo de contacto</h2><p>Nombre: ${request.body.name} </p> <p> Correo electrónico: <a href='mailto: ${request.body.email}'>${request.body.email}</a></p><p>Código Postal: ${request.body.zip}</p><p>Número de contacto:${request.body.number} </p><p>Checkbox: ${request.body.checkbox}</p>`;
    var mail = {
        from: 'Team: Xyncs Web Studio',
        to: 'contacto@nassermuebles.com',
        subject: '¡Alguien ha dejado sus datos en tu sitio web!',
        html: htmlBody
    };
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            return console.log(err);
        } else {
            console.log("message sent!");
        };
    });
    var mail = {
        from: 'Team: Nasser Muebles',
        to: request.body.email,
        subject: '¡5% de descuento adicional!',
        html: '<h2>Gracias por registrarte</h2> <h4>¡Ya tienes tu 5% adicional!</h4> <br/> <img src="cid:bannerPrivacidad.png"/>',
        attachments: [{
            filename: 'bannerPrivacidad.png',
            path: 'public/assets/images/bannerPrivacidad.png',
            cid: 'bannerPrivacidad' //same cid value as in the html img src
        }]
    };
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Second message sent!");
        };
    });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});