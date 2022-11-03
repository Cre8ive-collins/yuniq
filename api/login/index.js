const {connection, decrypt} = require('../services/utils')
// const {createUserTable} = require('../services/tableServices')

/**
 * register a user.
 * @param {string} context - app context.
 * @param {string} req - request object.
 */

async function login (context, req){
    if(req.body){   
        const { email, password } = req.body 
        if(!email || !password ){
            context.res = {
                status : 400,
                body : 'Email, Password is required head'
            }
            return
        }
        let sql = 'SELECT * FROM users WHERE email = ? '
        let _user = await connection.promise().query(sql, email)
        if(_user[0].length){
            let user = _user[0][0]
            // CHECK IF PASSWORD IS CORRECT 
            let _password = decrypt(user.password)
            if(_password != password){
                context.res = {
                    status : 401,
                    body : 'Wrong password'
                }
            }else{
                context.res = {
                    body : user
                }
            }
        }else{
            context.res = {
                status : 404,
                body : 'User does not exist'
            }
        }
    }else{
        context.res = {
            status : 400,
            body : 'Email, Password is required body'
        }
    }



}

module.exports = login