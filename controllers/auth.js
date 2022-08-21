const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { promisify } = require('util');


//const db = mysql.createConnection({
//    host: process.env.DATABASE_HOST,
//    user: process.env.DATABASE_USER,
//    password: process.env.DATABASE_PASSWORD,
//    database: process.env.DATABASE
//});

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.incrementBody = (req, res) => {

const {id} = req.body;
console.log(id);

    db.query('UPDATE users SET C2C = C2C + 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/body");
            console.log("C2C Incremented")
        }
    })
}

exports.decrementBody = (req, res) => {

    const { id } = req.body;
    console.log(id);

    db.query('UPDATE users SET C2C = C2C - 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/body");
            console.log("C2C Decremented")
        }
    })
}

exports.incrementMind = (req, res) => {

    const { id } = req.body;
    console.log(id);

    db.query('UPDATE users SET C1C = C1C + 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/mind");
            console.log("C1C Incremented")
        }
    })
}

exports.decrementMind = (req, res) => {

    const { id } = req.body;
    console.log(id);

    db.query('UPDATE users SET C1C = C1C - 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/mind");
            console.log("C1C Decremented")
        }
    })
}

exports.incrementSpirit = (req, res) => {

    const { id } = req.body;
    console.log(id);

    db.query('UPDATE users SET C3C = C3C + 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/spirit");
            console.log("C3C Incremented")
        }
    })
}

exports.decrementSpirit = (req, res) => {

    const { id } = req.body;
    console.log(id);

    db.query('UPDATE users SET C3C = C3C - 1 WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //res.status(200).redirect("/spirit");
            console.log("C3C Decremented")
        }
    })
}

exports.register = (req, res) => {
    //console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) { 
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if( password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                //console.log("results:"); 
                //console.log(results); 
                
                return res.render('register', {
                    message1: 'User registered. You can now:'
                });
         
            }
        })
    });

}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if ( !email || !password ) {
            return res.status(400).render('login',{
                message: 'Please provide an email and a password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if (results.length < 1 || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Enter valid email or password'
                })
            } else {
                const id = results[0].id;

                console.log("Login: User ID is:");
                console.log(id);

                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/body"); 
            } 
        })
    } catch (error) {
        console.log(error);
    }

}

exports.isLoggedIn = async (req, res, next) => {
    //console.log(req.cookies);
    if( req.cookies.jwt){
        try {
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            console.log("isLoggedIn: Decoded cookie:")
            console.log(decoded);

            //2) Check if the user still exists
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log("select from users query results:")
                console.log(result);

                if(!result){
                    return next();
                }

                req.user = result[0];
                return next();

            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }

}

exports.logout = async (req, res, ) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000), 
        httpOnly: true
    });

    res.status(200).redirect('/')

}