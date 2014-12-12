#!/bin/bash

# sanity check
export ARANGODB_SERVER=http://localhost:8529

if [ -z "$DB_LINK_PORT_8529_TCP_ADDR" ];  then
  echo "warning: DB_LINK_PORT_8529_TCP_ADDR env variable is not set, please link the ArangoDB with '--link instancename:db-link'"
else
  ARANGODB_SERVER=http://${DB_LINK_PORT_8529_TCP_ADDR}:8529
fi

# switch into the guesser directory
cd /data/node_modules/guesser

# and start node
node -e 'require("guesser")'
