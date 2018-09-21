rm -rf ./dist
NODE_PATH=../shared:dist ./node_modules/.bin/tsc
rm -rf ./dist/shared
mv ./dist/server/source/* ./dist
rm -rf ./dist/server