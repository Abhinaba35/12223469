const Url = require('./models/url');
const { nanoid } = require('nanoid');

class UrlShortenerService {
    constructor() {
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    }

    async createShortUrl(url, validity = 30, customShortcode = null) {
        const shortUrl = customShortcode || nanoid(7);
        const expiry = new Date(Date.now() + validity * 60 * 1000);
        const newUrl = new Url({
            originalUrl: url,
            shortUrl,
            createdAt: new Date(),
            expiry: expiry,
            clicks: 0
        });
        await newUrl.save();
        return {
            shortLink: `${this.baseUrl}/${shortUrl}`,
            expiry: expiry.toISOString()
        };
    }

    async getOriginalUrl(shortcode, clientInfo = {}) {
        const url = await Url.findOne({ shortUrl: shortcode });
        if (url) {
            // Check if expired
            if (url.expiry && new Date() > url.expiry) {
                return null;
            }
            url.clicks = (url.clicks || 0) + 1;
            await url.save();
            return url.originalUrl;
        }
        return null;
    }

    async getStats(shortcode) {
        const url = await Url.findOne({ shortUrl: shortcode });
        if (url) {
            return {
                shortcode: url.shortUrl,
                originalUrl: url.originalUrl,
                createdAt: url.createdAt ? url.createdAt.toISOString() : null,
                expiry: url.expiry ? url.expiry.toISOString() : null,
                totalClicks: url.clicks || 0,
                isExpired: url.expiry ? new Date() > url.expiry : false
            };
        }
        return null;
    }
}

module.exports = new UrlShortenerService();
