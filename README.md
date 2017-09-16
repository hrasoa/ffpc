# React Progressive Web Application

> Just another boilerplate

## Getting started

    $ git clone git@github.com:hrasoa/react-pwa.git app
    $ cd app
    $ npm i
    $ npm run start:dev
    
or if you are using yarn:
    
    $ git clone git@github.com:hrasoa/react-pwa.git app
    $ cd app
    $ yarn
    $ npm run start:dev  
    
To run the production build:

    $ npm run build && npm start
    
## Features per environment

| | Dev | Production
--- | --- | ---
Hot Module Replacement | :star: |
GraphiQL | :star: |
Code Split + Async Components | :star: | :star:
Server Side Rendering | :star: | :star:
Chunkhashes | | :star:
Service Worker (precache, offline support) | | :star:
Minify + gzip | | :star:
