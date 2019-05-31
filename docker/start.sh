#!/usr/bin/env bash
su docker <<EOF
    cd ~/code
    echo "Build Project"
    grunt build
    echo "Setup development database"
    php initdb.php
    echo "Start development server"
    php -S 0.0.0.0:8080 -t public
EOF
