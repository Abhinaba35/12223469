require('dotenv').config();

const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
const TEST_SERVER_URL = 'http://20.244.56.144/evaluation-service/logs';

async function Log(stack, level, packageName, message) {
    try {
        const axios = require('axios');
        
        const logData = {
            stack: stack,
            level: level,
            package: packageName,
            message: message
        };
        
        const response = await axios.post(TEST_SERVER_URL, logData, {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to send log to server:', error.message);
        return null;
    }
}

module.exports = { Log };