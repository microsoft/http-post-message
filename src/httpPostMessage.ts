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
  postMessage<T>(window: Window, message: any): Promise<T>;
}

export class HttpPostMessage {
  // TODO: See if it's possible to share tracking properties interface?
  // The responsibility of knowing how to configure windowPostMessageProxy for http should
  // live in this http class, but the configuration would need ITrackingProperties
  // interface which lives in WindowPostMessageProxy. Use <any> type as workaround
  static addTrackingProperties(message: any, trackingProperties: any): any {
    message.headers = message.headers || {};
    if (trackingProperties && trackingProperties.id) {
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
    if (typeof (message && message.statusCode) !== 'number') {
      return false;
    }

    return !(200 <= message.statusCode && message.statusCode < 300);
  }

  defaultHeaders: any;
  defaultTargetWindow: Window;
  windowPostMessageProxy: IPostMessage;

  constructor(
    windowPostMessageProxy: IPostMessage,
    defaultHeaders: any = {},
    defaultTargetWindow?: Window
  ) {
    this.defaultHeaders = defaultHeaders;
    this.defaultTargetWindow = defaultTargetWindow;
    this.windowPostMessageProxy = windowPostMessageProxy;
  }

  get<T>(url: string, headers: any = {}, targetWindow: Window = this.defaultTargetWindow) {
    return this.send<T>({
      method: "GET",
      url,
      headers
    }, targetWindow);
  }

  post<T>(url: string, body: any, headers: any = {}, targetWindow: Window = this.defaultTargetWindow) {
    return this.send<T>({
      method: "POST",
      url,
      headers,
      body
    }, targetWindow);
  }

  put<T>(url: string, body: any, headers: any = {}, targetWindow: Window = this.defaultTargetWindow) {
    return this.send<T>({
      method: "PUT",
      url,
      headers,
      body
    }, targetWindow);
  }

  patch<T>(url: string, body: any, headers: any = {}, targetWindow: Window = this.defaultTargetWindow) {
    return this.send<T>({
      method: "PATCH",
      url,
      headers,
      body
    }, targetWindow);
  }

  delete<T>(url: string, body: any = null, headers: any = {}, targetWindow: Window = this.defaultTargetWindow) {
    return this.send<T>({
      method: "DELETE",
      url,
      headers,
      body
    }, targetWindow);
  }

  send<T>(request: IHttpPostMessageRequest, targetWindow: Window = this.defaultTargetWindow): Promise<IHttpPostMessageResponse<T>> {
    request.headers = this.assign({}, this.defaultHeaders, request.headers);

    if(!targetWindow) {
      throw new Error(`target window is not provided.  You must either provide the target window explicitly as argument to request, or specify default target window when constructing instance of this class.`);
    }
    return this.windowPostMessageProxy.postMessage(targetWindow, request);
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