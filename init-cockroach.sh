#!/bin/bash

cockroach start-single-node --insecure --background

# Wait for CockroachDB to start
sleep 5

cockroach sql --insecure --execute="CREATE USER your_username WITH PASSWORD admin;"
cockroach sql --insecure --execute="GRANT ALL ON DATABASE defaultdb TO admin;"
cockroach sql --insecure --execute="CREATE DATABASE blockDAG;"
cockroach sql --insecure --execute="GRANT ALL ON DATABASE blockDAG TO admin;"

# Keep the container running
tail -f /dev/null