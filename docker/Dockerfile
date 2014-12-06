# use base node.js
FROM dockerfile/nodejs

# maintainer info
MAINTAINER Frank Celler <f.celler@arangodb.com>

# update system
RUN apt-get -y -qq --force-yes update

# use NPM to install the guesser game
RUN npm -G install guesser

# application is running on port 8000
EXPOSE 8000

# start the node server
WORKDIR /data/node_modules/guesser
CMD [ "node", "-e", "require('guesser')" ]
