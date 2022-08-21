const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user
    });
});

router.get('/register', (req, res)=> {
    res.render('register');
});

router.get('/login', (req, res)=> {
   res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    
    if( req.user ) {
        res.render('profile', {
          user: req.user  
        });
    } else {
        res.redirect('/login');
    }
    
    
});

router.get('/mind', authController.isLoggedIn, (req, res) => {

    if (req.user) {
        res.render('mind', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }


});

router.get('/body', authController.isLoggedIn, (req, res) => {

    if (req.user) {
        res.render('body', {
            user: req.user
        });
        // res.render('body', { user2: JSON.stringify(req.user)}  );


    } else {
        res.redirect('/login');
    }


});

router.get('/spirit', authController.isLoggedIn, (req, res) => {

    if (req.user) {
        res.render('spirit', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }


});

module.exports = router;