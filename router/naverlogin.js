module.exports = function(app) {
    var client_id = 'Ab5yjCBw2TeJSiu58lZj',
        client_secret = 'Ab5yjCBw2TeJSiu58lZj',
        state = "RAMDOM_STATE",
        redirectURI = encodeURI("http://172.30.1.22:3000/callback"),
        api_url = "";

    app.get('/naverlogin', function (req, res) {
        api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
    });

    app.get('/callback', function (req, res) {
        code = req.query.code;
        state = req.query.state;
        api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
            + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
        var request = require('request');
        var options = {
            url: api_url,
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                res.end(body);
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        });
    });

}