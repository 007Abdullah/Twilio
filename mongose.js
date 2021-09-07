var mongoose = require('mongoose');

let dbURI = "mongodb+srv://root:root@cluster0.s5oku.mongodb.net/twilio?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on("connected", function () {
    console.log("Mongoose Is Connected");
});
mongoose.connection.on("disconnected", function () {
    console.log("Mongoose Is Disconnected");
    process.exit(1);
});
mongoose.connection.on("error", function (err) {
    console.log("Mongoose connection error ", err);
    process.exit(1);
});

process.on('SIGINT', function () {
    console.log("App is terminated");
    mongoose.connection.close(function () {
        console.log("Mongoose default connection closed");
        process.exit(0);
    });
});

var userNumberSchema = mongoose.Schema({
    'PhoneNumber': String,
    'otpCode': String,
    'createdOn': { 'type': Date, 'default': Date.now },
    'activeSince': Date,
});

var userNumber = mongoose.model('phoneNumber', userNumberSchema);


var PhoneNumberCreateUser = mongoose.Schema({
    'UserNumber': String,
    'Password': String,
    'createdOn': { 'type': Date, 'default': Date.now }
})

var CreateUser = mongoose.model('createUser', PhoneNumberCreateUser);

module.exports = ({
    userNumber: userNumber,
    CreateUser: CreateUser,
});
