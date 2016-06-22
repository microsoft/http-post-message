import * as hpm from '../src/httpPostMessage';

describe("HttpPostMessage", function () {
  let windowPostMessageProxy: hpm.IPostMessage;
  let httpPostMessage: hpm.HttpPostMessage;
  const postMessage = (message: any): Promise<any> => {
    return Promise.resolve(message);
  };
  const postMessageSpy = jasmine.createSpy("postMessageSpy").and.callFake(postMessage);
  
  beforeAll(function () {
    windowPostMessageProxy = {
      postMessage: postMessageSpy
    };
    
    httpPostMessage = new hpm.HttpPostMessage(window, windowPostMessageProxy);
  });
  
  beforeEach(function () {
    // emtpy
  });
  
  afterEach(function () {
    postMessageSpy.calls.reset();
  });
  
  afterAll(function () {
    // empty
  });
  
  it("get() calls windowPostMessageProxy.postMessage with GET request", function () {
    // Arrange
    const expectedRequest = {
      method: "GET",
      url: 'report/pages',
      headers: {}
    };
    
    // Act
    httpPostMessage.get(expectedRequest.url);
    
    // Assert
    expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
  });
  
  it("post() calls windowPostMessageProxy.postMessage with POST request", function () {
    // Arrange
    const expectedRequest = {
      method: "POST",
      url: 'report/filters',
      headers: {},
      body: {
        testBody: true
      }
    };
    
    // Act
    httpPostMessage.post(expectedRequest.url, expectedRequest.body);
    
    // Assert
    expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
  });
  
  it("put() calls windowPostMessageProxy.postMessage with PUT request", function () {
    // Arrange
    const expectedRequest = {
      method: "PUT",
      url: 'report/pages/activepage',
      headers: {},
      body: {
        testBody: true
      }
    };
    
    // Act
    httpPostMessage.put(expectedRequest.url, expectedRequest.body);
    
    // Assert
    expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
  });
  
  it("patch() calls windowPostMessageProxy.postMessage with PATCH request", function () {
    // Arrange
    const expectedRequest = {
      method: "PATCH",
      url: 'report/pages/activepage',
      headers: {},
      body: {
        testBody: true
      }
    };
    
    // Act
    httpPostMessage.patch(expectedRequest.url, expectedRequest.body);
    
    // Assert
    expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
  });

  it("delete() calls windowPostMessageProxy.postMessage with DELETE request", function () {
    // Arrange
    const expectedRequest = {
      method: "DELETE",
      url: 'report/pages/activepage',
      headers: {},
      body: {
        testBody: true
      }
    };
    
    // Act
    httpPostMessage.delete(expectedRequest.url, expectedRequest.body);
    
    // Assert
    expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
  });
  
  describe("custom headers", function () {
    let defaultHeaders: any;
    let httpPostMessageProxyWithDefaultHeaders: hpm.HttpPostMessage;
    
    beforeAll(function () {
      defaultHeaders = {
        'custom-header-1': 'customValue',
        'request-id': 'abc123'
      };
      httpPostMessageProxyWithDefaultHeaders = new hpm.HttpPostMessage(window, windowPostMessageProxy, defaultHeaders);
    });
    
    it("default headers can be set, which will be included with each request", function () {
      // Arrange
      const expectedRequest = {
        method: "GET",
        url: 'report/pages',
        headers: defaultHeaders
      };
      
      // Act
      httpPostMessageProxyWithDefaultHeaders.get(expectedRequest.url);
      
      // Assert
      expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
    });
    
    it("all the methods can have optional parameter to pass other custom headers for the single request", function () {
      // Arrange
      const singleRequestHeaders = {
        'new-custom-header': 'newCustomValue'
      };
      const headers = $.extend({}, defaultHeaders, singleRequestHeaders);
      headers['new-custom-header'] = 'newCustomValue';
      
      const expectedRequest = {
        method: "GET",
        url: 'report/pages',
        headers
      };
      
      // Act
      httpPostMessageProxyWithDefaultHeaders.get(expectedRequest.url, singleRequestHeaders);
      
      // Assert
      expect(postMessageSpy).toHaveBeenCalledWith(window, expectedRequest);
    });
  });
  
  describe("message manipulation", function () {
    it("addTrackingProperties should add a custom id header to each message", function () {
      // Arrange
      const testMessage = {
        method: "GET",
        url: "report/pages",
        headers: {}
      };
      const trackingProperties = {
        id: (Math.random() + 1).toString(36).substring(7)
      };
      
      // Act
      const resultMessage = hpm.HttpPostMessage.addTrackingProperties(testMessage, trackingProperties);
      
      // Assert
      expect(resultMessage.headers.id).toEqual(trackingProperties.id);
    });

    it("addTrackingProperties will set header.id to undefined if trackingProperties or trackingProperties.id provided is falsy", function () {
      // Arrange
      const testMessage = {
        method: "GET",
        url: "report/pages",
        headers: {}
      };
      
      // Act
      const resultMessage = hpm.HttpPostMessage.addTrackingProperties(testMessage, { x: 'abc' });
      
      // Assert
      expect(resultMessage.headers.id).toBe(undefined);
    });
    
    it("getTrackingProperties should return tracking properties object by fetching id from headers of message", function () {
      // Arrange
      const testMessage = {
        method: "GET",
        url: "report/pages",
        headers: {
          id: (Math.random() + 1).toString(36).substring(7)
        }
      };
      const expectedTrackingProperties = {
        id: testMessage.headers.id
      };
      
      // Act
      const actualTrackingProperties = hpm.HttpPostMessage.getTrackingProperties(testMessage);
      
      // Assert
      expect(actualTrackingProperties).toEqual(expectedTrackingProperties);
    });
    
    it("isErrorMessage should return true for messages with statusCode outside of range [200-300)", function () {
      expect(hpm.HttpPostMessage.isErrorMessage({ statusCode: 100 })).toEqual(true);
      expect(hpm.HttpPostMessage.isErrorMessage({ statusCode: 200 })).toEqual(false);
      expect(hpm.HttpPostMessage.isErrorMessage({ statusCode: 300 })).toEqual(true);
      expect(hpm.HttpPostMessage.isErrorMessage({ statusCode: 400 })).toEqual(true);
      expect(hpm.HttpPostMessage.isErrorMessage({ statusCode: 500 })).toEqual(true);
    });
  });
});