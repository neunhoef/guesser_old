#!/bin/bash
set -e

# sanity check
export ARANGODB_SERVER=http://localhost:8529

if [ -z "$DB_LINK_PORT_8529_TCP_ADDR" ];  then
  echo "warning: DB_LINK_PORT_8529_TCP_ADDR env variable is not set, please link the ArangoDB with '--link instancename:db-link'"
  exit 1
else
  ARANGODB_SERVER=http://${DB_LINK_PORT_8529_TCP_ADDR}:8529
fi

if test "$init" = 1;  then
  echo "Going to initialize the database at $DB_LINK_PORT_8529_TCP"

  foxx-manager --server.endpoint $DB_LINK_PORT_8529_TCP fetch zip /install/guesser-foxx.zip
  foxx-manager --server.endpoint $DB_LINK_PORT_8529_TCP mount guesser /guesser
  foxx-manager --server.endpoint $DB_LINK_PORT_8529_TCP setup /guesser
fi

# switch into the guesser directory
cd /data/node_modules/guesser

# and start node
node -e 'require("guesser")'
