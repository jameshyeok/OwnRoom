var $find_place_results = $('#find-place-results'),
    $input_find_place = $('#input-find-place'),
    li = [],
    index = 0,
    length = 0,
    selectIndx = 0,
    coordinate = {
        lat: 33.450701,
        lng: 126.570667
    },
    keyCode = {
//            BACKSPACE: 8,
        ENTER: 13,
        ESC: 27,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    },
    regionData = {
        subways: [],
        address: []
    },
    data = {};

$input_find_place.keyup(function (e) {
    switch (e.keyCode) {
        case keyCode.ENTER:
        case keyCode.ARROW_DOWN:
        case keyCode.ARROW_LEFT:
        case keyCode.ARROW_RIGHT:
        case keyCode.ARROW_UP:
            break;
        default:
            findLocation();
            break;
    }
});

$input_find_place.keydown(function (e) {
    switch (e.keyCode) {
        case keyCode.ARROW_UP:
            index = selectArrowUp(index, length);
            break;
        case keyCode.ARROW_DOWN:
            index = selectArrowDown(index, length);
            break;
        case keyCode.ENTER:
            selectEnter();
            break;
        case keyCode.ESC:
            selectESC();
        default:
            index = 0;
            break;
    }
});

function selectArrowUp(curIndx, length) {
    if (curIndx <= length && curIndx > 0) {
        li[curIndx].removeClass('item');
        var prevIndx = curIndx - 1;
        $input_find_place.val(li[prevIndx].text());
        selectIndx = prevIndx;
        li[prevIndx].addClass('item');
        li[prevIndx][0].scrollIntoView();
        prevIndx <= 0 ? ++prevIndx : prevIndx;
    }
    return prevIndx;
}

function selectArrowDown(curIndx, length) {
    if (curIndx <= length && curIndx >= 0) {
        $input_find_place.val(li[curIndx].text());
        selectIndx = curIndx;
        li[curIndx].addClass('item');
        li[curIndx][0].scrollIntoView();
        var prevIndx = curIndx - 1;
        if (prevIndx >= 0)
            li[prevIndx].removeClass('item');
        ++curIndx <= length ? curIndx : --curIndx;
    }
    return curIndx;
}

function selectEnter() {
    // window.location.replace('./search');
    extractData();
    sendData();
    // window.open("search_room.html?");
}

function selectESC() {
    $input_find_place.val("");
    $find_place_results.empty();
}

function sendData() {
    // window.open("search?lat=" + coordinate.lat + "&lng=" + coordinate.lng);
    location.href = "searchRoom?lat=" + coordinate.lat + "&lng=" + coordinate.lng;
}

function extractData() {
    var subwaysLen = regionData.subways.length,
        addressLen = regionData.address.length;

    // 지하철만 있을 때
    if (subwaysLen && (!addressLen)){
        coordinate = {
            lat: regionData.subways[selectIndx].lat,
            lng: regionData.subways[selectIndx].lng
        }
        data = regionData.subways[selectIndx];
    }
    // 주소만 있을 때
    else if ((!subwaysLen) && addressLen) {
        coordinate = {
            lat: regionData.address[selectIndx].lat,
            lng: regionData.address[selectIndx].lng
        }
        data = regionData.address[selectIndx];
    }
    // 둘 다 있을 때
    else {
        if (selectIndx <= subwaysLen - 1){
            coordinate = {
                lat: regionData.subways[selectIndx].lat,
                lng: regionData.subways[selectIndx].lng
            }
            data = regionData.subways[selectIndx];
        } else {
            coordinate = {
                lat: regionData.address[selectIndx].lat,
                lng: regionData.address[selectIndx].lng
            }
            data = regionData.subways[selectIndx];
        }

    }
}

function findLocation() {
    var html = "";
    $.ajax({
        type: 'GET',
        url: 'https://apis.zigbang.com/property/search/address/v1',
        data: 'q=' + $('#input-find-place').val(),
        success: function (results) {
            $find_place_results.empty();
            regionData = {
                subways: [],
                address: []
            };
            results.subways.forEach(function (result, index) {
                html += '<li>' + result.name + '(' + result.description + ')' + '</li>';
                var subwayObj = {
                    name: result.name,
                    lat: result.lat,
                    lng: result.lng,
                    description: result.description
                };
                regionData.subways.push(subwayObj);
            });
            results.addresses.forEach(function (result, index) {
                html += '<li>' + result.local1 + " " + result.local2 + " " + result.local3 + '</li>';
                var addressObj = {
                    local1: result.local1,
                    local2: result.local2,
                    local3: result.local3,
                    lat: result.web_lat,
                    lng: result.web_lng
                };
                regionData.address.push(addressObj);
            });
            $find_place_results.html(html);
            try {
                li = [];
                $find_place_results.find('li').each(function (index, item) {
                    var $this = $(this);
                    li.push($this);
                    $this.bind("click", function(){
                        $input_find_place.val($this.text());
                        $find_place_results.empty();
                    });
                });
                length = li.length;
                if(!length--){
                    selectIndx = 0;
                    coordinate = {
                        lat: 33.450701,
                        lng: 126.570667
                    };
                }
                console.log("success calling the data")
            } catch (e) {
                console.log(e);
            }
        }
    });
}