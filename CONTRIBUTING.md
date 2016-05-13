# Contributing

## Setup

```
git clone https://pbix.visualstudio.com/DefaultCollection/PaaS/Integrate/_git/http-post-message
```
```
npm install
typings install
```

## Building

```
tsc -p .
```
or when in VS Code: `Ctrl + Shift + B`

## Testing

```
npm test
```

> Note currently there seems to be a problem when running the tests using PhantomJS which is why the `--debug` flag is coded into the test command.

Run tests with PhantomJS
```
gulp test
```

Run tests with Chrome and close when finished
```
gulp test --debug
```

Run tests with Chrome and remain open for debugging
```
gulp test --debug --watch
```
