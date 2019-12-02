#!/usr/bin/env bash
# デプロイされたURLをSlackに通知するスクリプト
# 使い方は
# $ ./slack_deployed.sh https://example.com
# のように、通知したいURLを後ろにつけて呼び出す

# 引数を変数に格納
DEPLOYED_URL=${1:-not_set}

set +xe # デバッグ出力をオフにする
echo -e "\n\n"
printf '🎉\e[34m Success! \e[m🎉\n'
printf '\e[34m The deployed URL: \e[m '${DEPLOYED_URL}"\n"

# デプロイ結果をSlackに通知
curl -X POST -H 'Content-type: application/json' \
  --data '{"text": "Thank you for your commit!  Your change makes us strong.\nURL: '${DEPLOYED_URL}'",
           "username": "CPL",
           "channel": "test-channel",
           "icon_emoji": ":tada:",
           }' \
  https://hooks.slack.com/services/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
