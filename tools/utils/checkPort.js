import logger from 'boldr-utils/es/logger';
import detect from 'detect-port';

// Determines whethere the given port is in use
const checkPort = (port, callback) => {
  detect(port, (error, unusedPort) => {
    if (error) {
      logger.error('error attempting to detect port', error);
      process.exit();
    }

    if (port === unusedPort) {
      callback();
    } else {
      logger.error(`port: ${port} is in use.`);
      logger.info('Ports can be configured in boldr.config.js');
      process.exit();
    }
  });
};

export default checkPort;
