sourceDir=""
if [ "$1" = "production" ]
then
    sourceDir="../../lms-book.club"
elif [ "$1" = "staging" ]
then
    sourceDir="../../staging.lms-book.club"
else
    echo "Unknown run target: $1"
    exit 1
fi
mkdir _logs
touch _logs/out.log
touch _logs/err.log
ENV=$1 NODE_PATH=./dist forever start ./dist/run.js -o _logs/out.log -e _logs/err.log --sourceDir=${sourceDir}