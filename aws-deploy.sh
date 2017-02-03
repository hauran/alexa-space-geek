
cp -r ./src/ ./temp
cd temp
zip -r ../temp.zip .
cd ..

rm -rf ./temp

aws lambda update-function-code \
  --function-name Space-Geek-Example-Skill\
  --zip-file "fileb://temp.zip"
