/**
 * @typedef InvalidParam
 * @type {object}
 * @property {string} name - Param name.
 * @property {string} reason - Reason of the error.
 */

/**
 * @class HTTPError
 * @extends {Error}
 * @classdesc A custom error class for HTTP errors.
 *
 * @property {number} status - The HTTP status code associated with this error.
 * @property {string} title - A short, human-readable summary of the problem.
 * @property {string} detail - A human-readable explanation specific to this occurrence of the problem.
 * @property {string} type - A URI reference that identifies the problem type.
 * @property {string} instance - A URI reference that identifies the specific occurrence of the problem.
 * @property {InvalidParam[]} invalidParams - Additional information about the error.
 */
export default class HTTPError extends Error {
  constructor(status, title, detail, invalidParams) {
    super(title)
    this.status = status
    this.title = title
    this.detail = detail
    this.invalidParams = invalidParams
  }
}
