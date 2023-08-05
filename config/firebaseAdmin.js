const admin = require("firebase-admin");
const serviceAccount = require("../google-services.json");
// add your firebase db url here
const FIREBASE_DATABASE_URL='https://sitetouristique-35790-default-rtdb.europe-west1.firebasedatabase.app/';
admin.initializeApp({    
    credential: admin.credential.cert(serviceAccount),    
    databaseURL: FIREBASE_DATABASE_URL
});
const firebaseAdmin = {};
firebaseAdmin.sendMulticastNotification = function(payload) {    
    admin.database().ref("Tokens").get().then((snapshot)=>{
        console.log("Tokens")
        console.log(snapshot)
        const tokens=snapshot.val();
        const message = {        
            notification: {            
                title: payload.title,            
                body: payload.body        
            },        
            tokens: tokens,        
            data: payload.data || {}    
        };
        admin.messaging().sendMulticast(message).then(()=>{
            //res.status(200).send("Notification sent successfully")
        });
    })
};

async function sendNotif(payload){
    return firebaseAdmin.sendMulticastNotification(payload);
}

module.exports = admin;