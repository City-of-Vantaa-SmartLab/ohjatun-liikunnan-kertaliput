# The Frontend

This README will cover the topics regarding the Frontend application. We will not be discussing about how to get started or development on the Frontend, because those details have been talked in great details [in the project-wide README.md](/README.md)

That being said, here are the topics you can expect coverage in this README.

*   Technologies and framework
*   Communication with backend
*   Authentication, Cookies and Local storage
*   Theming, styling and, responsive design and customizations
*   Localization and Internationalization
*   Progressive aspect of the stack
*   Tested browsers and platform

Without further ado, let's dive into the words.

## Technologies and Framework

A frontend application has many aspects, so it's natural that there are many technologies at play. Here's the list of what we use in the frontend.

*   Single page application
*   React as the view library
*   Mobx as state management. Data is organized as OOP style (not tree like Redux)
*   React-emotion (a library like Styled-Components) as a CSS-in-JS styling solution.
*   Prettier as code formatter
*   Eslint as linter

The project was bootstrapped by [Create React App](https://github.com/facebook/create-react-app)

## Communication with backend

The frontend is a single page application, thus, it will talk to the backend via REST API endpoints.

All the styles, images and assets are managed by the frontend.

## Authentiaction, Cookies and Local storage

The frontend uses authentication token embedded in secure, HTTP ONLY cookies to do authentication.

Upon start-up, it will attempt to authenticate against the backend using the cookies.

The app stores 1 piece of data in the target host localStorage. It is a flag to see if the user has grant us the right to use cookies or not.

## Theming, styling and customizations

### Theming

The application uses a simple Javascript object to hold styling configurations. This object is in [index.js](./src/index.js)

It looked like this:

```javascript
theme = {
    signInBackground: 'rgb(60, 143, 222)',
    main: 'rgb(60, 143, 222)',
    complementary: 'rgb(249, 229, 30)',
    green: '#66BB6A',
    error: 'rgb(250, 66, 59)',
    errorReservationTime: 'rgb(117, 59, 189)',
    errorReservationResource: 'rgb(255, 143, 28)',
    errorReservationAuth: '#616161',
    errorReservationNoTicket: '#795548',
};
```

Here are the functionalities of the parameters:

*   signInBackGround: is the background color of the sign-in page
*   main: the main color of the app, used thoroughly in text, shapes, buttons, etc
*   complementary: the secondary color of the app, used for highlighting
*   green: the successful "green" of the app
*   error: is the typical error color code

Below that, is the color error code signifying the reason why the user cannot reserve a class session.

The app use Calibri as the main font for typography.

### Customization

Certain components have been standardized and are used as the basis of the app. these includes:

*   Input components
*   Modal
*   Button

These can be found at `./src/components/`

If you have a need to use these elements, make sure to import these instead of creating your own!

### Responsive design

Most of the responsive design and global css are in [index.css](./src/index.css).
At the moment, two type of screens are supported: phones and desktop.

## Localization and internationalization.

The app supports localization and internalization.

These belongs to 2 categorization: Translation and Datetime

At the moment, only the Finnish language are supported. The translations are put in one place at [content.json](./src/stores/content.json)

If you are working on adding translation in English or Swedish, please extends the data in the json file. For example, if you are working to add swedish translation, you can modify the file in this way:

```json
{
    "finnish": {...}
    "swedish": {
        // fill in your contents in Swedish here
    }
}
```

Do note that, we have yet to implement a system to let user switch language.

## Progressive aspect of the app

The app is a progressive web app and can be installed on Android and ios 11+ devices.

For now, we have used the default configuration of service worker from Create React App. This caches all static assets for front-end application.

## Tested browsers and platforms

The frontend supports iOS and android.

For ios devices, you must use a version of safari that supports Progressive web app implementation (coming with ios 11)

Here is a list of tested and supported browsers.

| Browser (Platform/Version) | Supported |               🐛 Bugs                |
| -------------------------- | :-------: | :----------------------------------: |
| Chrome (v66/Desktop)       |    ✅     |                  -                   |
| Firefox (v60/Desktop)      |    ✅     |            No blur effect            |
| Safari (iOS 11)            |    ✅     | No prompt installing to home devices |
| Safari (v11/Desktop)       |    ✅     | No prompt installing to home devices |
