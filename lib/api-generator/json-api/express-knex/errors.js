class JsonApiError extends Error {
  constructor(input) {
    let opts = {};
    const inputType = typeof input;
    switch (inputType) {
      case 'string':
        opts.detail = input;
        break;
      case 'object':
        opts = Object.keys(input).reduce((acc, k) => {
          if (k && input[k] && JsonApiError.allowedProps.includes(k)) {
            acc[k] = input[k];
          }
          return acc;
        }, {});
        break;
      default:
        throw new TypeError(`Could not parse ${input} as JsonApiError options`);
    }
    Object.keys(opts)
      .forEach((k) => {
        this.constructor[k] = opts[k];
      });
    super(opts.detail);
    Error.captureStackTrace(this, JsonApiError)
  }
  toJSON() {
    return JsonApiError.allowedProps.reduce((error, propName) => {
      if (this.constructor[propName]) {
        error[propName] = this.constructor[propName];
      }
      return error;
    }, {});
  }
}

JsonApiError.allowedProps = ['id', 'link', 'status', 'code', 'title', 'detail', 'source', 'meta'];

class BadRequestError extends JsonApiError { }
BadRequestError.id = 'BadRequestError';
BadRequestError.status = '400';
BadRequestError.code = 'BadRequestError';
BadRequestError.title = 'BadRequestError';
BadRequestError.detail = '[BadRequestError] - BadRequestError';
class UnauthorizedError extends JsonApiError { }
UnauthorizedError.id = 'UnauthorizedError';
UnauthorizedError.status = '401';
UnauthorizedError.code = 'UnauthorizedError';
UnauthorizedError.title = 'UnauthorizedError';
UnauthorizedError.detail = '[UnauthorizedError] - UnauthorizedError';
class ForbiddenError extends JsonApiError {}
ForbiddenError.id = 'ForbiddenError';
ForbiddenError.status = '403';
ForbiddenError.code = 'ForbiddenError';
ForbiddenError.title = 'ForbiddenError';
ForbiddenError.detail = '[ForbiddenError] - ForbiddenError';
class NotFoundError extends JsonApiError {}
NotFoundError.id = 'NotFoundError';
NotFoundError.status = '404';
NotFoundError.code = 'NotFoundError';
NotFoundError.title = 'NotFoundError';
NotFoundError.detail = '[NotFoundError] - NotFoundError';
class MethodNotAllowedError extends JsonApiError {}
MethodNotAllowedError.id = 'MethodNotAllowedError';
MethodNotAllowedError.status = '405';
MethodNotAllowedError.code = 'MethodNotAllowedError';
MethodNotAllowedError.title = 'MethodNotAllowedError';
MethodNotAllowedError.detail = '[MethodNotAllowedError] - MethodNotAllowedError';
class NotAcceptableError extends JsonApiError {}
NotAcceptableError.id = 'NotAcceptableError';
NotAcceptableError.status = '406';
NotAcceptableError.code = 'NotAcceptableError';
NotAcceptableError.title = 'NotAcceptableError';
NotAcceptableError.detail = '[NotAcceptableError] - NotAcceptableError';
class RequestTimeoutError extends JsonApiError {}
RequestTimeoutError.id = 'RequestTimeoutError';
RequestTimeoutError.status = '408';
RequestTimeoutError.code = 'RequestTimeoutError';
RequestTimeoutError.title = 'RequestTimeoutError';
RequestTimeoutError.detail = '[RequestTimeoutError] - RequestTimeoutError';
class UnsupportedMediaTypeError extends JsonApiError {}
UnsupportedMediaTypeError.id = 'UnsupportedMediaTypeError';
UnsupportedMediaTypeError.status = '415';
UnsupportedMediaTypeError.code = 'UnsupportedMediaTypeError';
UnsupportedMediaTypeError.title = 'UnsupportedMediaTypeError';
UnsupportedMediaTypeError.detail = '[UnsupportedMediaTypeError] - UnsupportedMediaTypeError';
class InternalError extends JsonApiError {}
InternalError.id = 'InternalError';
InternalError.status = '500';
InternalError.code = 'InternalError';
InternalError.title = 'InternalError';
InternalError.detail = '[InternalError] - InternalError';
class MalformedError extends JsonApiError {}
MalformedError.id = 'MalformedError';
MalformedError.status = '400';
MalformedError.code = 'MalformedError';
MalformedError.title = 'MalformedError';
MalformedError.detail = '[MalformedError] - Error in reading malformed JSON';
class NotImplementedError extends JsonApiError {}
NotImplementedError.id = 'NotImplementedError';
NotImplementedError.status = '501';
NotImplementedError.code = 'NotImplementedError';
NotImplementedError.title = 'NotImplementedError';
NotImplementedError.detail = '[NotImplementedError] - NotImplementedError';
class BadGatewayError extends JsonApiError {}
BadGatewayError.id = 'BadGatewayError';
BadGatewayError.status = '502';
BadGatewayError.code = 'BadGatewayError';
BadGatewayError.title = 'BadGatewayError';
BadGatewayError.detail = '[BadGatewayError] - BadGatewayError';
class ServiceUnavailableError extends JsonApiError {}
ServiceUnavailableError.id = 'ServiceUnavailableError';
ServiceUnavailableError.status = '503';
ServiceUnavailableError.code = 'ServiceUnavailableError';
ServiceUnavailableError.title = 'ServiceUnavailableError';
ServiceUnavailableError.detail = '[ServiceUnavailableError] - ServiceUnavailableError';
class GatewayTimeoutError extends JsonApiError {}
GatewayTimeoutError.id = 'GatewayTimeoutError';
GatewayTimeoutError.status = '504';
GatewayTimeoutError.code = 'GatewayTimeoutError';
GatewayTimeoutError.title = 'GatewayTimeoutError';
GatewayTimeoutError.detail = '[GatewayTimeoutError] - GatewayTimeoutError';


module.exports = {
  JsonApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  NotAcceptableError,
  RequestTimeoutError,
  UnsupportedMediaTypeError,
  InternalError,
  MalformedError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError
}

