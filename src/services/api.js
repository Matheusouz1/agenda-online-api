const axios = require ("axios");
require("dotenv/config");

const baseURL = process.env.AXIOSURL || "http://localhost:3333"

const api = axios.create({
    baseURL: baseURL,
});

module.exports = api