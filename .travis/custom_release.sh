#!/usr/bin/env bash
set -e
set -x

NODE_ENV=production npm run build

if [ "${TRAVIS_BRANCH}" = "master" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
    done
fi

if [ "${TRAVIS_BRANCH}" = "stable" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
