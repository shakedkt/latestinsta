
const dbService = require('../../services/db.service.js')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getByUserName,
    getByEmail,
    remove,
    update,
    add,
    removePost
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(criteria).toArray();
        users.forEach(user => delete user.password);

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

async function getByUserName(userName) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({userName})
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userName}`)
        throw err;
    }
}
async function getByEmail(email) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({email})
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw err;
    }
}

async function remove(userId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.deleteOne({"_id":ObjectId(userId)})
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw err;
    }
}

async function update(post) {
    const collection = await dbService.getCollection('user')
    
    const userName = post.createdBy.userName
    
    try {
        await collection.updateOne(
            { "userName" : userName},
            { $push: { posts: post } });
        return post;    
    } catch (err) {
        console.log(`ERROR: cannot update post ${post}`)
        throw err;
    }
}

async function removePost(post) {
    const collection = await dbService.getCollection('user')

    try {
        await collection.updateOne(
            { "userName" : post[0].createdBy.userName},
            { "$pull": { "posts": {"_id": ObjectId(post[0]._id)}}});
        return ; 
    } catch (err) {
        console.log(`ERROR: cannot remove post ${post}`)
        throw err;
    }
}

async function add(user) {
    const collection = await dbService.getCollection('user')

    user.avatar = 'https://i.imgur.com/tR6ajVu.jpg'
    user.isAdmin = false
    user.isGuest = false
    user.followers = []
    user.following = []
    user.posts = []
    user.likeCount = 0

    console.log('user at add',user);
    
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }
    if (filterBy.minBalance) {
        criteria.balance = {$gte : +filterBy.minBalance}
    }
    return criteria;
}

