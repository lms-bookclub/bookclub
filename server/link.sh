# Create symlinks for shared dirs
rm ./source/@shared
rm ./source/@env
ln -s $PWD/../shared/@shared ./source/@shared
ln -s $PWD/../shared/@env ./source/@env