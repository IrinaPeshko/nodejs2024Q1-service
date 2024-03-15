# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
docker-compose up
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## Additional Setup Instructions

### Creating `.env` File
Before running the application, ensure you have a `.env` file set up in your project root. You can create this file by copying the `.env.example` provided in the repository and modifying it to suit your environment.

### Running Tests in a Separate Terminal
Tests are an essential part of this application. To run tests while the application is running, open a new terminal window and execute the test commands. This allows you to run tests without interrupting the application's runtime.

### OpenAPI Documentation
The application is documented using OpenAPI. You can access the documentation by navigating to `http://localhost:4000/doc/` in your web browser after starting the application.

### Debugging
For debugging in Visual Studio Code, you can use the integrated debugger. Just press <kbd>F5</kbd> to start debugging.

Remember to check the `package.json` file for other scripts that might be useful in development or production environments.
