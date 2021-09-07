const PORT = process.env.PORT || 5000;
const express = require('express');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var http = require("http");
const client = require('twilio')('AC20cc2c5810301f9759dcccc5cc42163b', '8fd618f8f3f3b2aeb09a8918616471ce');
const app = express();
var server = http.createServer(app);
var { userNumber, CreateUser } = require('./mongose');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));
app.get('/', (req, res, next) => {
    res.send(`
        <div style="text-align:center;padding-top:40px;">
            <h1>Welcome to My Website</h1>
            <h1>Your are message send Successfully</h1>
            <p>This is a Hello World App</p>
        </div>
    `)
})

app.post('/UserNumber', (req, res, next) => {
    if (!req.body.phoneNumber) {
        res.send({
            message: "phoneNumber Required",
            status: 404
        });
        return;
    }
    const otp = Math.floor(getRandomArbitrary(111111, 999999));
    userNumber.create({
        'PhoneNumber': req.body.phoneNumber,
        'otpCode': otp,
    }).then((doc) => {
        console.log('Mogonse Doc :', doc);
        client.messages.create({
            body: `OTP CODE :${otp}`,
            to: '+923121278181',
            from: '+14804181704',
        }).then((message) => {
            console.log('Message :', message);

            res.send({
                message: `Message Has Been Send :${message} `,
                status: '200'
            });
            req.body.headers = doc.PhoneNumber
        }).catch((error) => {
            console.log('Error :', error);
            res.send({
                message: `Unexpected Error ${error}`,
                status: 500,
            });
        });
    });
})
app.post('/phoneUserPassword', (req, res, next) => {
    if (!req.body.Password) {
        res.send({
            message: 'Please Required Password',
            status: '404',
        });
        return;
    }
    // console.log('req.body.headers', req.body.phoneNumber);
    userNumber.findOne({ PhoneNumber: req.body.phoneNumber }, (err, user) => {
        if (err) {
            res.send({
                message: 'User Number Not Found',
                status: 404,
            });
        }
        else if (user) {
            console.log('User :', user);
            // CreateUser.create({
            //     'UserNumber':user.PhoneNumber,
            
            // }).then(() => {

            // })
        } else {

        }
    })


})



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}





server.listen(PORT, () => {
    console.log(`Server Started On Port`, PORT);
});