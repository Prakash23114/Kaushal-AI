const moongoose = require("mongoose");

async function connectToDB() {
    try {
        await moongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb Connected ")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectToDB