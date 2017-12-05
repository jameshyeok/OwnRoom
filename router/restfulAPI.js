module.exports = function(app, conn) {

    app.get('/', function(req, res){
        res.render('main.html');
    });

    app.get('/searchRoom', function(req, res){
        res.render('search_room.html');
    });

    app.get('/zipcode', function(req, res) {
        res.render('zipcode.html');
    });

    app.get('/register', function(req, res) {
        res.render('register.html')
    });

    app.get('/getRoomData', function(req, res){
        data = [];
        conn.query('SELECT * from building', function(err, rows){
            rows.forEach(function (result, index){
                data.push(result);
                console.log(result);
            });
            console.log(data);
            res.send(data);
        });

    });
    app.post('/inputData', function(req, res) {
        var roomInfo = {
            // roomNum: req.body.roomNum,
            space: parseInt(req.body.space),
            deposit: parseInt(req.body.deposit),
            monthly_rent: parseInt(req.body.monthlyRent),
            bid: null,
            floor: req.body.floor,
            parking: false,
            heating: false,
            explain: req.body.explain
        };
        if(req.body.parking === '1')
            roomInfo.parking = true;
        if(req.body.heating === '1')
            roomInfo.heating = true;
        console.log(roomInfo);
        conn.connect(function(err){
            if (err)
                throw err;
            // var sql = "INSERT INTO room (space, deposit, monthly_rent, floor, parking, heating, explain) VALUES(" +
            //     dataObj.space + "," + dataObj.deposit + "," + dataObj.monthlyRent + "," + dataObj.floor + "," + dataObj.parking + "," + dataObj.heating + "," + dataObj.explain + ")";
            // conn.query(sql, function(err, result){
            //     if (err) throw err;
            //     console.log('1 record was inserted!');
            // });
            var selectQuery = conn.query('SELECT bid from building WHERE address = ' + "'" + req.body.address + "'", function(err, rows){
                console.log(rows[0].bid);
                roomInfo.bid = rows[0].bid;
            });
            console.log(roomInfo);
            var insertQuery = conn.query('insert into room set ?', roomInfo, function(err, result){
                if (err) {
                    console.error(err);
                    throw err;
                }
                console.log(insertQuery);
            });
            console.log("Connected!");
        });
        res.end();
    });
}