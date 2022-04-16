const router = require('express').Router();
const {Auth} = require('two-step-auth');
var rsa = require("node-rsa");
var fs = require("fs");
const User = require('../models/user.model');
const bcrypt = require('bcrypt');


router.route('/').get((req, res) => {
    res.send('This is users page');
});

var generated_otp;

async function login(emailid){
    try{
      const data = await Auth(emailid, "Encypted File Transfer");
      return data.OTP;
    }
    catch(error){
      console.log(error);
    }
}

router.route('/otp').get((req, res) => {
    res.render('otp', { title: 'OTP' });
});

router.post("/signup", async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confPassword = req.body.password_conf;
    console.log(email);
    var query = {email : email};
    const user = await User.find(query);
    console.log(user);
    if(user.length == 0){
        if(password == confPassword){
            generated_otp = await login(email);
            res.render('otp', { title: 'OTP', email : email, password : password });
        }
        else{
            console.log('Passwords didnt match');
            res.redirect('/authentication/signupform');
        }
    }
    else{
        console.log("User Already Exists");
    }
    
    
    // res.redirect("/users/otp");
});

router.post("/otp", async (req, res)=>{
    const data = req.body;
    console.log(data);
    const input_otp = parseInt(data.otp);
    console.log(input_otp);
    console.log(generated_otp);
    const email = data.email;
    const password = data.password;
    if(input_otp===generated_otp){

        console.log("Generating..");
        const {publicKey, privateKey} = GeneratePair();
        console.log(publicKey);

        const salt = await bcrypt.genSalt()
        // const hashedEmail = await bcrypt.hash(userEmail,salt)
        const hashedPassword = await bcrypt.hash(password,salt)
        console.log(salt)
        console.log(hashedPassword)

        const newUser = new User({
            email : email,
            password : hashedPassword,
            publicKey : publicKey,
        });

        newUser.save()
        .then(() => {
            console.log("Success");
        })
        .catch((err)=>{
            console.log("Error : ")
        })

        res.redirect("/authentication/loginform");
    }
    else{
        console.log("OTPs didn't match");
        res.redirect("/authenticate/signupform");
    }
});

router.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    

})

function GeneratePair(){
    var key = new rsa().generateKeyPair();

    var publicKey = key.exportKey("public");
    var privateKey = key.exportKey("private");

    fs.openSync("./Keys/public.pem","w");
    fs.writeFileSync("./Keys/public.pem",publicKey,"utf8");    

    fs.openSync("./Keys/private.pem","w");
    fs.writeFileSync("./Keys/private.pem",privateKey,"utf8");

    return {publicKey, privateKey}

}

// router.route("/generateKeys").get((req,res)=>{
    
// })

router.use((req, res) => {
    res.send("404 not found!");
});



module.exports = router;

