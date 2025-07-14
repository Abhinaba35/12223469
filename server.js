const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  logger.info('Connected to MongoDB');
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  logger.error('Error connecting to MongoDB:', error);
});
