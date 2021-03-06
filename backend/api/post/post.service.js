
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

async function query(amount) {
    amount = parseInt(amount)
    const collection = await dbService.getCollection('post')
    try {
        const posts = collection.find({}).limit(amount).sort({ "timeStamp": -1 }).toArray()
        return posts

    } catch (err) {
        console.log('ERROR: cannot find posts')
        throw err;
    }
}

async function remove(postId) {
    const collection = await dbService.getCollection('post')
    try {
        const post = await collection.find({ "_id": ObjectId(postId) }).toArray()
        await collection.deleteOne({ "_id": ObjectId(postId) })
        return post
    } catch (err) {
        console.log(`ERROR: cannot remove post ${postId}`)
        throw err;
    }
}

async function add(post) {
    post.byUserId = ObjectId(post.byUserId);
    post.aboutUserId = ObjectId(post.aboutUserId);

    const collection = await dbService.getCollection('post')
    try {
        await collection.insertOne(post);
        return post;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function update(comment) {
    const collection = await dbService.getCollection('post')
    const postId = comment.postId;
    try {
        await collection.update(
            { "_id": ObjectId(postId) },
            { $push: { comments: comment } });
        return comment;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function changeLike(post) {
    const collection = await dbService.getCollection('post')
    console.log('post', post)
    console.log('post.isliked', post.isliked);

    try {
        await collection.updateOne(
            { "_id": ObjectId(post._id) },
            { $inc: { "likes": (post.isliked) ? -1 : +1 } },
            { $set: { "isliked": (post.isliked) ? true : false } }
        )
        return post;
    } catch (err) {
        console.log(`ERROR: Please try again tomorrow`)
        throw err;
    }
}


module.exports = {
    query,
    remove,
    add,
    update,
    changeLike
}


