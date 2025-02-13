const mongoose=require ('mongoose')


const connectdb=async()=>{
    try{
         await mongoose.connect(`${process.env.MONGODB_URI}`)
         console.log(`\nMongoDB connected!! Database Host: ${mongoose.connection.host}`);
    }
    catch(error){
        console.log("Mongodb connection error",error);
        process.exit(1)
    }
}

module.exports = connectdb;