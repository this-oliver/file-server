# grep name from package.json
NAME=$(grep name package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')
# grep version number from package.json
VERSION=$(grep version package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
# build docker image with name and version
docker build -t $NAME:$VERSION .
# tag new version as latest
docker tag $NAME:$VERSION $NAME:latest
