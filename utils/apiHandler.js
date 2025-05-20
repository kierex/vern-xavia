const axios = require("axios");

const apiHandler = {

    async get(url, params = {}) {

        try {

            const response = await axios.get(url, { params });

            return response.data;

        } catch (error) {

            console.error(`GET request error: ${error.message}`);

            return { error: true, message: error.message };

        }

    },

    async post(url, data = {}, headers = {}) {

        try {

            const response = await axios.post(url, data, { headers });

            return response.data;

        } catch (error) {

            console.error(`POST request error: ${error.message}`);

            return { error: true, message: error.message };

        }

    }

};

module.exports = apiHandler;