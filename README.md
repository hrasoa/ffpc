# React Progressive Web Application
> :hourglass_flowing_sand: In progress

Real world progressive web application starter-kit running with an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/), 
a [Nginx reverse proxy](https://www.nginx.com/) and [pm2](http://pm2.keymetrics.io/) on production:

:earth_africa: :arrow_right: ```Ingress``` :arrow_right: ```Nginx``` :arrow_right: ```App```

## Stack

[```docker```](https://www.docker.com/)
[```kubernetes```](https://kubernetes.io/)
[```nginx```](https://www.nginx.com/)
[```pm2```](http://pm2.keymetrics.io/)
[```redis (sessions storage)```](https://redis.io/)
[```express```](http://expressjs.com/)
[```mysql```](https://www.mysql.com/)
[```graphql```](https://www.apollographql.com/)
[```webpack```](https://webpack.js.org/)
[```react```](https://reactjs.org/)
[```redux```](http://redux.js.org/)
[```redux-saga```](https://redux-saga.js.org/)
[```firebase```](https://firebase.google.com/)
[```workboxjs```](https://workboxjs.org/)

## Features

| | Development | Production
--- | --- | ---
Hot Module Replacement | :star: |
GraphiQL | :star: |
Code Split + Async Components | :star: | :star:
Server Side Rendering | :star: | :star:
Service Worker (precache, offline) | | :star:
Long term caching | | :star:
Minify + gzip | | :star:

## Prerequisites

* [docker-compose](https://docs.docker.com/compose/)
* [docker-sync (optional)](http://docker-sync.io/)

## Getting started

    $ git clone git@github.com:hrasoa/react-pwa.git app
    $ cd app/docker
    $ docker-sync start
    
    # init the db instance
    $ docker-compose run --rm db
    
    # in a new tab stop the containers after finished
    $ docker stop $(docker ps -q --filter "ancestor=mysql")   
    
    # install the app
    $ docker-compose run --rm --no-deps app yarn
    
    # run
    $ docker-compose up

Visit http://localhost:8001

Running the production build:

    $ docker-compose run --rm --no-deps app npm run build:production
    $ docker-compose -f docker-compose.yml -f production.yml up    
  
## Deployment

This app will work out of the box on  [![gcp](https://avatars0.githubusercontent.com/u/2810941?s=14&v=4) Google Cloud Platform](https://cloud.google.com/) with  [![jenkins](https://avatars0.githubusercontent.com/u/107424?s=14&v=4) Jenkins CI Multi-branch Pipeline](https://jenkins.io/doc/book/pipeline/multibranch/), more information in the [Jenkinsfile](/Jenkinsfile).

You can follow [this tutorial to setup your continuous delivery pipeline](https://cloud.google.com/solutions/continuous-delivery-jenkins-container-engine).

## License

[MIT](/LICENSE)
   
