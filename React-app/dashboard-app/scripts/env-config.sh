#!/bin/bash

# Create a JavaScript file with the EVs
echo "window._env_ = {" > env-config.js
echo "  REACT_APP_BACKEND_URL: '$REACT_APP_BACKEND_URL'," >> env-config.js
echo "};" >> env-config.js