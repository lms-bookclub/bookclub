rm ../shared/@env/*.js
rm ../shared/@env/*.js.map
ENV=local NODE_PATH=../shared tsc ../shared/@env/*.ts --baseUrl ../shared
ENV=local NODE_PATH=source/js:../shared concurrently \"webpack\" \"gulp\"