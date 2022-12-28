const mongoose =require('mongoose')

mongoose.connect(process.env.BDD_URI,{
    useNewUrlParser:true,
    useUnifiedTopology : true
})
db=mongoose.connection
db.on("error",console.error.bind(console,"connection error"))
db.once("open",function(){
    console.log("connecte a Mongoose")
})