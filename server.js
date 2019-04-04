const express = require('express');
const axios = require('axios');
const cors = require('cors');
const OAuth = require('OAuth');

const CONSUMER_KEY = 'ZgKgITzgajaYI9QhX5YPJPS9J';
const CONSUMER_SECRET = 'gUYKTdvgi3FN77IR1mMdo6SiKN3oD0kwnU9p0GgCWXyVaTFAOF';
const TOKEN = '1111246373150695424-hOee2O8DI9Ma8Ub0nbq43iA1MM38IY';
const TOKEN_SECRET = 'RsjVxc34b79OZw1fT4TESVkwjjFzpiHjgZNp6tB4a0Qqa';

const PORT = 3002;
const BASE_URL = 'https://api.twitter.com/1.1/tweets/search'
const TIME_FRAME = 'fullarchive'; // [30day / fullarchive]
const ENT_NAME = 'dev';

const app = express();
app.use(cors());

function getTweetsByParams(params) {
    return new Promise((resolve, reject) => {
        var oauth = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            CONSUMER_KEY,
            CONSUMER_SECRET,
            '1.0A',
            null,
            'HMAC-SHA1'
         );

        let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        queryString = queryString ? `?${queryString}` : '';

        let url = `${BASE_URL}/${TIME_FRAME}/${ENT_NAME}.json${queryString}`;

        console.log('URL: ', url);

        oauth.get(
            url,
            TOKEN, 
            TOKEN_SECRET,           
            function (error, data, response){
                if (error) {
                    console.error("Error: ", error);
                    reject(error);
                } else {
                    data = JSON.parse(data);
                    resolve(data);
                }     
        });  
    })
}

app.get('/getTweets', (req, res) => {
    console.log('Req Params: ', req.query);

    getTweetsByParams(req.query)
    .then((response) => {
        console.log('Success!');
        res.send(response);
    })
    .catch((error) => {
        console.log('Error: ', error);
        res.sendStatus(400);
    })
})

app.listen(PORT, () => console.log(`Twitter Server app listening on port: ${PORT}, time frame: ${TIME_FRAME}`))
