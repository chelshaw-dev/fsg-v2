# free-shit-guide v2

WIP of Free Shit Guide refactor

## Getting Started

To get you started you can simply clone the repository and install the dependencies:


### Prerequisites

You need git to clone the free-shit-guide repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

You must have node.js and its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/). This project uses [yarn](http://yarnpkg.com/) as the package manager and [gulp](http://gulpjs.com/) to build. [Firebase CLI](https://firebase.google.com/docs/cli/) also recommended.

### Clone repository

Clone the free-shit-guide repository using [git](http://git-scm.com/):

```
git clone https://github.com/chelshaw-dev/fsg-v2.git
cd fsg-v2
```


### Install Dependencies

Install the dependencies with yarn, and then build the public folder with gulp

```
yarn install
gulp build
```
You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `public` - contains the files that will be served


### Set Up Firebase

Now you'll want to get the [Firebase CLI up and running](https://firebase.google.com/docs/cli/):

```
npm install -g firebase-tools
firebase login
```

CD into project directory (if not already there) and run

```
firebase init
```

When it asks which directory to serve the public app, make sure to put `public`.
From the project directory, create `initialize.js` file. This will run before the main app and initialize firebase.

```
touch initilize.js
```

Create a new project in the [firebase console](https://console.firebase.google.com/) and copy the web initialization code into your new file. Should look like:

```
'use strict';

// Initialize Firebase
var config = {
  apiKey: "your-key-here",
  authDomain: "your-app.domain.com",
  databaseURL: "https://your.domain.com",
  projectId: "project-name",
  storageBucket: "my-app.appspot.com",
  messagingSenderId: "your-id-here"
};
firebase.initializeApp(config);
```

Run `gulp build`.

### Run the Application

With Firebase CLI installed, to serve the app simply run

```
firebase serve
```

Now browse to the app at `http://localhost:5000/`.

### Notes

Again, this is still a work in progress, so many views will not work. Stay tuned for updates.
