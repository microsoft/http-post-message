# htt-post-message
[![Build Status](https://travis-ci.com/Microsoft/http-post-message.svg?token=nXyWFYxRu6tVxUMJAuJr&branch=master)](https://travis-ci.com/Microsoft/http-post-message)

A generic messaging component to send HTTP style message payloads over the window.postMessage API. Requires an implementation of window postMessage proxy such as 'window-post-message-proxy'.

## Installation

```bash
npm install -g http-post-message
```

## Usage
The HttpPostMessage takes in an object that implements the IPostMessage interface which
is just one method `postMessage` which returns a Promise.

In the case below we created a mock postMessage proxy, but in normal usage you would likely use the accompanying library [window-post-message-proxy](https://pbix.visualstudio.com/DefaultCollection/PaaS/_git/window-post-message-proxy).

```typescript
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

