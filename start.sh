if [ -d 'build' ]; then
  echo 'Starting application on port 5000'
  serve -s build -p 5000
fi

if [ ! -d 'build' ]; then
  echo 'Build the application first by running `npm run build`'
fi