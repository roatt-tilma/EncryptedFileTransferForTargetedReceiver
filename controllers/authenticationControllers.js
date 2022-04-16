const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const user_signup = (req,res) => {
    const userEmail = req.body.email;
    const password = req.body.password;
    const confPassword = req.body.password_conf;


    User.find({email : userEmail},async (err,data) => {
        if(err){
            console.log('Error occured..')
            res.status(400).json('Error occured: ' + err);
        }
        else{
            if(data.length == 0){
                if(password == confPassword){
                    const salt = await bcrypt.genSalt()
                    // const hashedEmail = await bcrypt.hash(userEmail,salt)
                    const hashedPassword = await bcrypt.hash(password,salt)
                    console.log(salt)
                    console.log(hashedPassword)
                    const newUser = new User({
                        email : userEmail,
                        password : hashedPassword,
                    });
                    newUser.save()
                    .then(() => {
                        res.redirect('/');
                    })
                    .catch((err)=>{
                        res.status(400).json('Error: ' + err);
                    })
                }
            }
            else{
                console.log("Given email is already in use");
                res.json('Error : Given email is already in use');
            }
        }
    })

}

module.exports = user_signup;