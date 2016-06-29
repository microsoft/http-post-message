export interface IHttpPostMessageRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers: any;
  body?: any;
}

export interface IHttpPostMessageResponse<T> {
  statusCode: number;
  statusText: string;
  headers: any;
  body: T;
}

export interface IPostMessage {
  // postMessage<T>(message: any): Promise<T>;
  postMessage(window: Window, message: any): Promise<any>;
}

export class HttpPostMessage {
  // TODO: I the responsibility of knowing how to configure windowPostMessageProxy should
  // live in this class, but then we have to have hard dependency for things like ITrackingProperties
  static addTrackingProperties(message: any, trackingProperties: any): any {
    message.headers = message.headers || {};
    if(trackingProperties && trackingProperties.id) {
      message.headers.id = trackingProperties.id;
    }
    return message;
  }
  static getTrackingProperties(message: any): any {
    return {
      id: message.headers && message.headers.id
    };
  }
  static isErrorMessage(message: any): boolean {
    return !(200 <= message.statusCode && message.statusCode < 300);
  }
  
  defaultHeaders: any;
  targetWindow: Window;
  windowPostMessageProxy: any;
  
  constructor(
    targetWindow: Window,
    windowPostMessageProxy: IPostMessage,
    defaultHeaders: any = {}
  ) {
    this.defaultHeaders = defaultHeaders;
    this.targetWindow = targetWindow;
    this.windowPostMessageProxy = windowPostMessageProxy;
  }
  
  get<T>(url: string, headers: any = {}) {
    return this.send<T>({
      method: "GET",
      url,
      headers
    });
  }
  
  post<T>(url: string, body: any, headers: any = {}) {
    return this.send<T>({
      method: "POST",
      url,
      headers,
      body
    });
  }
  
  put<T>(url: string, body: any, headers: any = {}) {
    return this.send<T>({
      method: "PUT",
      url,
      headers,
      body
    });
  }
  
  patch<T>(url: string, body: any, headers: any = {}) {
    return this.send<T>({
      method: "PATCH",
      url,
      headers,
      body
    });
  }
  
  delete<T>(url: string, body: any = null, headers: any = {}) {
    return this.send<T>({
      method: "DELETE",
      url,
      headers,
      body
    });
  }
  
  send<T>(request: IHttpPostMessageRequest): Promise<IHttpPostMessageResponse<T>> {
    this.assign(request.headers, this.defaultHeaders);
    
    return this.windowPostMessageProxy.postMessage(this.targetWindow, request);
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