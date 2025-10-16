#!/usr/bin/env bash

cd $(dirname $0)/../ || exit

if [ -z "${GITHUB_PAT}" ]; then
  echo "The environment variable GITHUB_PAT is not set. Please regenerate the Vercel submodule token on Github and register it as the GITHUB_PAT environment variable in Vercel."
  echo "https://github.com/settings/tokens?type=beta"
  echo "https://vercel.com/<my-own-projects>/<project-name>/settings/environment-variables"
  exit 1
fi

echo "If the submodule update fails, please regenerate the Vercel submodule token on Github and register it as the GITHUB_PAT environment variable in Vercel."
echo "https://github.com/settings/tokens?type=beta"
echo "https://vercel.com/<my-own-projects>/<project-name>/settings/environment-variables"

git submodule set-url src/content "https://${GITHUB_PAT}@github.com/artsbymat/2nd-brain.git"

git submodule sync
git submodule update --init

# The original build script
npm run generate
