# Frontend

This README will cover the topics regarding the Frontend application. We will not be discussing about how to get started or development on the Frontend, because those details have been talked in great details [in the project-wide README.md](/README.md)

## Technologies and Framework

*   Single-page application (SPA) architecture.
*   React as the view library.
*   Mobx as state management library. Data is organized in OOP style (not as tree like in Redux).
*   React-emotion as a CSS-in-JS styling solution.
*   Prettier as code formatter.
*   ESLint as linter.

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

## Getting Started

Once you have the backend up and running and run:

```bash
npm install
npm start
```

Please note that in development mode the Service worker will be disabled.

To see the production version, install `http-server` globally as:

```bash
npm install -g http-server
```

To build and run, use:

```bash
npm run build
cd build
http-server .
```

Access the site in `localhost:8080`.

## Authentication, Cookies and Local Storage

Authentication token is stored in secure, HTTP-only cookies. On start-up, the frontend will make a test request to see if the token is still valid.

The app stores a flag to see if the user has grant us the right to use cookies or not `localStorage`.

## Styling

### Theming

The application uses a simple Javascript object to hold styling configurations. This object is in [index.js](./src/index.js)

Main parameters and their function:

*   `signInBackGround`: is the background color of the sign-in page
*   `main`: the main color of the app, used thoroughly in text, shapes, buttons, etc
*   `complementary`: the secondary color of the app, used for highlighting
*   `green`: the successful "green" of the app
*   `error`: is the typical error color code

The app use Calibri as the main font for typography.

### Customization

Certain components (e.g. input, modal and button) have been standardized and are used as the basis of the app. These can be found in `./src/components/`.

### Responsive Design

At the moment, two type of screens are supported: phones and desktop.

## Localization and Internationalization

The app supports localization and internalization of strings and time/date formats. The translations are located in [content.json](./src/stores/content.json). There is no way to switch language currently.

## Progressive Aspects of the App

The app is a PWA (Progressive Web Application). All static assets for frontend are cached by default when environment is production.

## Browser and Device Compatibility

The frontend is tested primarily against multiple iOS and Android versions.

To test PWA features, make sure you use a browser compatible with Service worker and Web app manifests.

### Tested Browsers

| Browser (Platform/Version) |               🐛 Bugs                |
| -------------------------- | :----------------------------------: |
| Chrome (v66/Desktop)       |                  -                   |
| Firefox (v60/Desktop)      |            No blur effect            |
| Safari (iOS 11)            | No prompt installing to home devices |
| Safari (v11/Desktop)       | No prompt installing to home devices |
