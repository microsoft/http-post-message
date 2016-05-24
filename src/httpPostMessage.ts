// TODO: Why does it say can't find module?
// import * as wpmp from 'window-post-message-proxy';

export interface IRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers: any;
  body?: any;
}

export interface IResponse {
  statusCode: number;
  statusText: string;
  headers: any;
  body: any;
}

export interface IWindowPostMessageProxy {
  // postMessage<T>(message: any): Promise<T>;
  postMessage(message: any): Promise<any>;
}

export class HttpPostMessage {
  // TODO: I the responsibility of knowing how to configure windowPostMessageProxy should
  // live in this class, but then we have to have hard dependency for things like ITrackingProperties
  static addTrackingProperties(message: any, trackingProperties: any): any {
    message.headers = message.headers || {};
    message.headers.id = trackingProperties.id;
    return message;
  }
  static getTrackingProperties(message: any): any {
    return {
      id: message.headers.id
    };
  }
  static isErrorMessage(message: any): boolean {
    return !(200 <= message.statusCode && message.statusCode < 300);
  }
  
  defaultHeaders: any;
  windowPostMessageProxy: any;
  
  constructor(
    windowPostMessageProxy: any,
    defaultHeaders: any = {}
  ) {
    this.defaultHeaders = defaultHeaders;
    this.windowPostMessageProxy = windowPostMessageProxy;
  }
  
  get(url: string, headers: any = {}): Promise<IResponse> {
    return this.send({
      method: "GET",
      url,
      headers
    });
  }
  
  post(url: string, body: any, headers: any = {}) {
    return this.send({
      method: "POST",
      url,
      headers,
      body
    });
  }
  
  put(url: string, body: any, headers: any = {}) {
    return this.send({
      method: "PUT",
      url,
      headers,
      body
    });
  }
  
  patch(url: string, body: any, headers: any = {}) {
    return this.send({
      method: "PATCH",
      url,
      headers,
      body
    });
  }
  
  delete(url: string, headers: any = {}) {
    return this.send({
      method: "DELETE",
      url,
      headers
    });
  }
  
  send(request: IRequest): Promise<IResponse> {
    this.assign(request.headers, this.defaultHeaders);
    
    return this.windowPostMessageProxy.postMessage(request);
  }
  
  /**
   * Object.assign() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   */
  private assign(target: any, ...sources: any[]): any {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const output = Object(target);
      sources.forEach(source => {
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      });
      
      return output;
  }
}