const express = require('express');
const router = express.Router();

const {insertUser, getUserByEmail} = require('../model/user/User.model');
const {hashPassword, comparePassword} = require('../helpers/bcrypt.helper');

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

    if(!passFromDb) {
        return res.json({ status: 'error', message: 'Invalid email or password!'});
    }
    
    const result = await comparePassword(password, passFromDb);
    console.log(result);

    res.json({ status: 'success', message: 'Login successfully!'})
}); 




module.exports = router;