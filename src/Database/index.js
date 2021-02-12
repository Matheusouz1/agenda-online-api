const mongoose = require('mongoose');
class MoongoDBConnect {
    
    connect(linkDB){
        mongoose.connect(`${linkDB}`, 
        {   useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        }).then(() => {
            console.log("Successfully connect to MongoDB.");
        })
        .catch(err => {
            console.error("Connection error: ", err);
            process.exit();
        });;
    }
};

module.exports = new MoongoDBConnect;