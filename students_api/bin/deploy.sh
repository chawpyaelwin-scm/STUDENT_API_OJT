#!/usr/bin/env bash
set -xe  # 実行中のコマンドの表示とエラーで終了
set -xo pipefail
# デプロイ用のスクリプトです。
# ファイルがある場所に移動
cd -- "$(dirname "$BASH_SOURCE")"

# ブランチにコミットがあった場合にCFnでデプロイを行います。
# npm run build:dev などでビルドした後に呼び出してください。
# 使い方の例
# e.g. npm run build:dev; ./bin/deploy.sh aws_profile_name

# 内部でAWS-CLIを使ってアップしているので、プロファイルを引数としてください
# Usage: $ ./bin/deploy.sh kaimyo-app-profile
# CircleCIはプロファイル名がなく、環境変数で渡されます
# Usage: $ ./bin/deploy.sh

# デプロイパスは現在のブランチ名から自動で取得されます
# ベースURL master: https://d134b1hojzxaib.cloudfront.net/
# ベースURL その他: https://drb4mh1rl6usj.cloudfront.net/
# e.g. feature/201904/yousan/fix-for-deploy だった場合
# https://drb4mh1rl6usj.cloudfront.net/feature/201904/yousan/fix-for-deploy にデプロイされます

cd ../

# 引数が指定されていればプロファイルとして設定する
if [[ ! -z "$1" ]]; then
  PROFILE='--profile '$1
else
  PROFILE=''
fi

# @see https://qiita.com/sugyan/items/83e060e895fa8ef2038c#git-symbolic-ref%E3%82%92%E4%BD%BF%E3%81%86
BRANCH_NAME=`cpl` # 現在のブランチ名を取得 e.g. feature/yousan/201812/for-deploy
DEPLOY_PATH=${BRANCH_NAME}

DEPLOYED_URL=${DEPLOY_PATH}
 # ブランチの方は Indexes 的なものが設定されていないので手動で入れる
