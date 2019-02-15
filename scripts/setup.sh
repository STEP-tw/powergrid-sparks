#!/usr/bin/env sh

cp .github/.git_pre_commit_hook .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
git config --local commit.template '.github/.git_commit_template'
npm install