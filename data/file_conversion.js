import axios from 'axios';
export { makeAPIRequest, startConversion };

const makeAPIRequest = async () => {
    var options = {
        method: 'POST',
        url: 'https://api.api2convert.com/v2/jobs',
        headers: {
            'x-oc-api-key': 'eb13dd06bc02fb0bb95570dd9ce705ba',
            'Content-Type': 'application/json'
        },
        data: {
            input: [
                // No input (for inital call)
            ],
        }
    };

    axios.request(options)
        .then(function (response) {
            console.log(response.data);
            let result = [response.data.id, response.data.server];
            return result;
        })
        .catch(function (error) {
            console.error(error);
        });
};

const startConversion = async (result, file) => {
    return [result, file, "test"];
};


/*var options = {
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
    });*/