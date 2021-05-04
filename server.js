const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const ngrok = require('./app/get_public_url');
const http = require('http');

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//https://chatbotslife.com/build-viber-bot-with-nodejs-a21487e5b65

const bot = new ViberBot({
	authToken: '4d4d8acdb667dfb1-607e93a99a50202f-40e96eb653947ed1',
	name: "EchoBot",
	avatar: "https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/b95f/821be113f3e0537b8af3f9b27aa420d3fa5cb66c6250d875c0480598d90db95f.jpg" // It is recommended to be 720x720, and no more than 100kb.
});

bot.on(BotEvents.CONVERSATION_STARTED, (response) => {

    const roomname = response.userProfile.id;
    const username = response.userProfile.name;
    const profile_pic = response.userProfile.avatar;
    const country_origin = response.userProfile.country;
    const language_origin = response.userProfile.language;

    //Do something with user data
    console.log('hello message received');
})
// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    // Echo's back the message to the client. Your bot logic should sit here.
    console.log('hello message received', message);
	response.send(message);
});

// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_SENT, (message, userProfile) => {
	// Echo's back the message to the client. Your bot logic should sit here.
	console.log('hello', userProfile);
});

bot.onSubscribe(response => console.log(`Subscribed: ${response.userProfile.name}`));

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router();              // get an instance of the express Router

// // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.post('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });   
// });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.use('/api', router);
//app.use("/viber/webhook", bot.middleware());

// START THE SERVER
// =============================================================================
/*ngrok.getPublicUrl().then(publicUrl => {
    console.log('Set the new webhook to', publicUrl);
    bot.setWebhook(publicUrl).then(res => {
        app.listen(port, () => {
            console.log(`Application running on port: ${port}`);
        });
    }).catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
        console.error(error);
        process.exit(1);
    })
})*/
// app.listen(port, () => {
// 	console.log(`Application running on port: ${port}`);
//     bot.setWebhook('https://8f1ae1d1837f.ngrok.io/viber/webhook').catch(error => {
//         console.log('Can not set webhook on following server. Is it running?');
//         console.error(error);
//         process.exit(1);
//     });
// });
ngrok.getPublicUrl().then(publicUrl => {
    console.log('Set the new webhook to"', publicUrl);
    http.createServer(bot.middleware()).listen(port, () => {
        bot.setWebhook(publicUrl).then(data => {
            console.log('Magic happens on port ' + port);
        }).catch(err => {
            console.log('Error ', err);
        });
    });
}).catch(error => {
    console.log('Can not connect to ngrok server. Is it running?');
    console.error(error);
});
