import axios from 'axios';
export { makeAPIRequest, startConversion };

const makeAPIRequest = async () => {
    let result = [];
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

    await axios.request(options)
        .then(function (response) {
            result = [response.data.id, response.data.server];
            console.log(response);
        })
        .catch(function (error) {
            console.error(error);
        });
    
    return result;
};

const startConversion = async (result, file) => {
    // This is a test
    return [result, file];
};