#!/bin/bash

su docker <<EOF
    cd ~/code
    echo "install build tools"
    npm install --only=dev
    echo "build project"
    grunt build
    echo "setup development database"
    php initdb.php
    echo "Start development server"
    php -S 0.0.0.0:8080 -t public
EOF
