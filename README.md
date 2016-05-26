# htt-post-message

A library to enabled HTTP communication over window.postMessage using window-post-message-proxy.  The enables communicating with iframes in a well known protocol and pattern.

## Installation
```
npm install -g http-post-message
```

## Usage
The HttpPostMessage takes in an object that implements the IPostMessage interface which
is just one method `postMessage` which returns a Promise.

In the case below we created a mock proxy, but in normal usage you would likely use the accompanying library 'window-post-message-proxy'.

```
import * as hpm from 'http-post-message';

const stubWindowPostMessageProxy: hpm.IPostMessage = {
  postMessage(message: any) {
    console.log(message);
    return Promise.resolve(message):
  }
}

const httpPostMessage = new hpm.HttpPostMessage(stubWindowPostMessageProxy);

httpPostMessage.get('target/path')
  .then(response => {
    ...
  });
```

### Methods
The object supports all the standard http methods, `get`, `post`, `put`, `patch`, and `delete`.
You can also send an `IRequest` object directly to the lower-level `send` method.

