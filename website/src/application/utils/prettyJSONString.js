module.exports = prettyJSONString = (inputString) => {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}