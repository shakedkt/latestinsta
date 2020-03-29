const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(userName, password) {
    logger.debug(`auth.service - login with email: ${userName}`)
    if (!userName || !password) return Promise.reject('email and password are required!')

    const user = await userService.getByUserName(userName)
    
    if (!user) return Promise.reject('Invalid userName or password')
    const match = password == user.password// TODO await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')

    delete user.password;
    return user;
}

async function signup(email, password, username) {
    logger.debug(`auth.service - signup with email: ${email}, username: ${username}`)
    if (!email || !password || !username) return Promise.reject('email, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({email, password: hash, username})
}

module.exports = {
    signup,
    login,
}