const {connection, encrypt} = require('../services/utils')

/**
 * register a user.
 * @param {string} context - app context.
 * @param {string} req - request object.
 */

async function register_new_user (context, req){
    if(req.body){   
        const { email, password, firstname, lastname } = req.body 
        if(!email || !password || !firstname || !lastname){
            context.res = {
                status : 400,
                body : 'Email, Password, Firstname. Lastname is required head'
            }
            return
        }
        // HASH PASSWORD BEFORE SAVING 
        let _password = encrypt(password)
        try{
            await connection.promise().query('INSERT INTO users SET ?', {email, password : _password, firstname, lastname})
            context.res = {
                body : "User registered"
            }
        }catch(err){
            context.res = {
                status : 400,
                body : err.code === 'ER_DUP_ENTRY' ? "Email already exists" : err
            }
        }
    }else{
        context.res = {
            status : 400,
            body : 'Email, Password, Firstname. Lastname is required body'
        }
    }



}

module.exports = register_new_user