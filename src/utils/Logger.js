const mb = "sns"
const DEBUG = `[${mb} DEBUG]:`;
const METRICS_OPT_IN = 'metricsOptIn'
/**
 * Wrapper class that allows us to override
 * console.log and console.error and in the future
 * we will have flags to do different actions based on
 * the environment, for ex. log to a remote server if prod
 */
const __DEV__ = process.env.NODE_ENV==="development"
export default class Logger {
  /**
   * console.log wrapper
   *
   * @param {object} args - data to be logged
   * @returns - void
   */
  static  log(...args) {
    // Check if user passed accepted opt-in to metrics
    if (__DEV__) {
      args.unshift(DEBUG);
      console.log.apply(null, args); // eslint-disable-line no-console
    } 
  }

  /**
   * console.error wrapper
   *
   * @param {Error} error - error to be logged
   * @param {string|object} extra - Extra error info
   * @returns - void
   */
  static  error(error, extra) {
    // Check if user passed accepted opt-in to metrics
    const metricsOptIn =  localStorage.getItem(METRICS_OPT_IN);
    if (__DEV__) {
      console.warn(DEBUG, error); // eslint-disable-line no-console
    } else if (metricsOptIn === 'agreed') {
      let exception = error;

      if (!error) {
        if (!extra) {
          return console.warn('No error nor extra info provided');
        }

        const typeExtra = typeof extra;
        switch (typeExtra) {
          case 'string':
            exception = new Error(extra);
            break;
          case 'object':
            if (extra.message) {
              exception = new Error(extra.message);
            } else {
              exception = new Error(JSON.stringify(extra));
            }
            break;
          default:
            exception = new Error('error to capture is not an error instance');
        }
      } else if (!(error instanceof Error)) {
        const type = typeof error;
        switch (type) {
          case 'string':
            exception = new Error(error);
            break;
          case 'object':
            exception = new Error(JSON.stringify(error));
            break;
          default:
            exception = new Error('error to capture is not an error instance');
        }
        exception.originalError = error;
      }
      if (extra) {
        if (typeof extra === 'string') {
          extra = {message: extra};
        }
        // withScope(scope => {
        // 	scope.setExtras(extra);
        // 	captureException(exception);
        // });
      } else {
        //captureException(exception);
      }
    }
  }

  /**
   * captureMessage wrapper
   *
   * @param {object} args - data to be logged
   * @returns - void
   */
  static  message(...args) {
    // Check if user passed accepted opt-in to metrics
    if (__DEV__) {
      args.unshift(DEBUG);
      // console.log.apply(null, args); // eslint-disable-line no-console
    }
  }
}
