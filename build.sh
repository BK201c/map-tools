#!/usr/bin/env sh

# 发生错误时终止
set -e

# 打tag
yarn release --release-as minor

# 合并分支
git checkout master
git merge dev

# 打包app
yarn run app:build
