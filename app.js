const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const loggingMiddleware = require('./loggingMiddleware');
const urlShortenerService = require('./urlShortenerService');
const logger = require('./logger');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
const urlService = require('./urlShortenerService');

// Register endpoint for /evaluation-service/register
app.post('/evaluation-service/register', async (req, res) => {
    // You can add your registration logic here. For now, just return a success message.
    await logger.info('handler', 'POST /evaluation-service/register request received');
    res.status(201).json({
        message: 'Registered successfully!'
    });
});

// Also support the typo route for /evalution-service/register
app.post('/evalution-service/register', async (req, res) => {
    await logger.info('handler', 'POST /evalution-service/register (typo) request received');
    res.status(201).json({
        message: 'Registered successfully! (typo route)'
    });
});

app.post('/shorturls', async (req, res) => {
    try {
        await logger.info('handler', 'POST /shorturls request received');
        
        const { url, validity, shortcode } = req.body;

        if (!url) {
            await logger.error('handler', 'URL is required but not provided');
            return res.status(400).json({
                error: 'URL is required',
                message: 'Please provide a valid URL to shorten'
            });
        }

        if (validity !== undefined && (!Number.isInteger(validity) || validity <= 0)) {
            await logger.error('handler', `Invalid validity provided: ${validity}`);
            return res.status(400).json({
                error: 'Invalid validity',
                message: 'Validity must be a positive integer representing minutes'
            });
        }

        const result = await urlService.createShortUrl(url, validity, shortcode);
        
        await logger.info('handler', `Short URL created successfully: ${result.shortLink}`);
        
        res.status(201).json(result);
    } catch (error) {
        await logger.error('handler', `Error creating short URL: ${error.message}`);
        
        if (error.message === 'Invalid URL format') {
            return res.status(400).json({
                error: 'Invalid URL',
                message: 'Please provide a valid URL format'
            });
        }
        
        if (error.message === 'Invalid shortcode format') {
            return res.status(400).json({
                error: 'Invalid shortcode',
                message: 'Shortcode must be alphanumeric and between 3-10 characters'
            });
        }
        
        if (error.message === 'Shortcode already exists') {
            return res.status(409).json({
                error: 'Shortcode conflict',
                message: 'The provided shortcode is already in use'
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create short URL'
        });
    }
});

app.get('/shorturls/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        
        await logger.info('handler', `GET /shorturls/${shortcode} request received`);

        const stats = await urlService.getStats(shortcode);
        
        if (!stats) {
            await logger.warn('handler', `Shortcode not found: ${shortcode}`);
            return res.status(404).json({
                error: 'Shortcode not found',
                message: 'The requested shortcode does not exist or has expired'
            });
        }

        await logger.info('handler', `Stats retrieved successfully for: ${shortcode}`);
        
        res.json(stats);
    } catch (error) {
        await logger.error('handler', `Error retrieving stats: ${error.message}`);
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to retrieve URL statistics'
        });
    }
});

app.get('/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        
        await logger.info('handler', `Redirect request for shortcode: ${shortcode}`);

        const clientInfo = {
            referrer: req.get('Referrer') || req.get('Referer'),
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress
        };

        const originalUrl = await urlService.getOriginalUrl(shortcode, clientInfo);
        
        if (!originalUrl) {
            await logger.warn('handler', `Shortcode not found or expired: ${shortcode}`);
            return res.status(404).json({
                error: 'Link not found',
                message: 'The requested short link does not exist or has expired'
            });
        }

        await logger.info('handler', `Redirecting ${shortcode} to ${originalUrl}`);
        
        res.redirect(302, originalUrl);
    } catch (error) {
        await logger.error('handler', `Error processing redirect: ${error.message}`);
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process redirect'
        });
    }
});

app.use('*', async (req, res) => {
    await logger.warn('handler', `Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        message: 'The requested endpoint does not exist'
    });
});

app.use(async (error, req, res, next) => {
    await logger.fatal('middleware', `Unhandled error: ${error.message}`);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
    });
});

module.exports = app;
