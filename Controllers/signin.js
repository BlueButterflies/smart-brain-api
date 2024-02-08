const handleSignin = (req, res, db, bcrypt) => {
    const passFromBody = req.body.password;
    const emailFromBody = req.body.email;

    db.select('hash', 'email').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const passFromDB = data[0].hash;

            const isValidPass = bcrypt.compareSync(passFromBody, passFromDB)

            if (isValidPass) {
                return db.select('*').from('users')
                    .where('email', '=', emailFromBody)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => {
                        res.status(400).json('unable to get user info')
                    })
            } else {
                res.status(400).json('invalid user');
            }

        })
        .catch(err => {
            res.status(400).json('wrong credentials')
        })
}

module.exports = {
    handleSignin: handleSignin
}