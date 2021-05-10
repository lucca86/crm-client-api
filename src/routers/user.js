const express = require('express');
const router = express.Router();

const {insertUser, getUserByEmail, getUserById} = require('../model/user/User.model');
const {setPasswordResetPin} = require('../model/resetPin/ResetPin.model');
const {hashPassword, comparePassword} = require('../helpers/bcrypt.helper');
const {createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const {userAuthorization} = require('../middlewares/authorization.middleware');


router.all("/", (req, res, next) => {
    // res.json({
    //     message: 'Return from user router'
    // });

    next();
});

// ****  Create new user route ****
router.post('/', async (req, res) => {

    const {name, company, address, phone, email, password} = req.body;

    try {
        // hash password
        const hashedPass = await hashPassword(password);

        const newUserObject = {
            name, 
            company, 
            address, 
            phone, 
            email, 
            password: hashedPass
        }

        const result = await insertUser(newUserObject);
        console.log(result);
    
        res.json({ message: 'New user created', result });
        
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', message: error.message });    
    }
});

// **** User sign in router ****
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

 
    if( !email || !password ) {
        return res.json({ status: 'error', message: 'Invalid form submition!'});
    }
    
    
    const user = await getUserByEmail(email);
    const passFromDb = user && user._id ? user.password : null;

    if(!passFromDb) 
        return res.json({ status: 'error', message: 'Invalid email or password!'});
   
    const result = await comparePassword(password, passFromDb);

    if(!result) {
        return res.json({ status: 'error', message: 'Invalid email or password!'});    
    }
    
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);
    console.log(result);

    res.json({ status: 'success', message: 'Login successfully!', accessJWT, refreshJWT} )
}); 


// Get user profile router
router.get('/', userAuthorization, async (req, res) => {

    // this data coming from database
    const _id = req.userId

    const userProf = await getUserById(_id)

    res.json({ user: userProf })
});

/* 
    A. Create ans send password reset pin number
        +1. receive de email
        +2. check if the user existe for the email
        3. create unique 6 digit pin
        4. save pin andemail in database
        5. email the pin
    
    B. Update password in DB
        1. receibe email, pin and new password
        2. validate pin
        3. excrypt new password
        4. update password in DB
        5. send email notification

    C. Server side form validator
        1. create middleware to validate form data

*/ 

router.post('/reset-password', async (req, res) => {
    const {email} = req.body;

    const user = await getUserByEmail(email);

    if(user && user._id){
        const setPin = await setPasswordResetPin(email);
        return res.json(setPin);
    }

    res.json({ status: "error", message: 'If the email is exist in our database, the password reset pin will be sent shorty'});
});



module.exports = router;