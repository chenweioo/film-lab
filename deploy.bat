@echo off
cd /d d:\cursor\film-lab-repo
echo Deploying film-lab to Netlify...
set "NETLIFY_AUTH_TOKEN=nfp_nSSeDPQBiWb3GYH9i7GCT1LohLe2GBqrd566"
npx netlify deploy --prod --dir .
echo.
echo Done! https://film-sim-lab.netlify.app
pause
