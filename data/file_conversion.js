import axios from 'axios';

let temp;

let URL = 'https://api.api2convert.com/v2/jobs';

var options = {
    method: 'POST',
    url: 'https://api.api2convert.com/v2/jobs',
    headers: {
        'x-oc-api-key': 'eb13dd06bc02fb0bb95570dd9ce705ba',
        'Content-Type': 'application/json'
    },
    data: {
        input: [
            {
                type: "remote",
                source: "https://example-files.online-convert.com/raster%20image/jpg/example_small.jpg"
            }
        ],
        conversion: [
            {
                category: "image",
                target: "png",
                options: {
                    // N/A
                }
            }
        ]
    }
};

axios.request(options)
    .then(function (response) {
        temp = response.data;
        URL = 'https://api.api2convert.com/v2/jobs/' + response.data.id;
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });

var options = {
    method: 'GET',
    url: URL,
    headers: {
        'x-oc-api-key': 'eb13dd06bc02fb0bb95570dd9ce705ba'
    }
};

axios.request(options)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });