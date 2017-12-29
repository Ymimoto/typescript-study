#! /bin/bash
# node用ファイルを作成するのが大変なため、シェルを書いておく
if [ $# -eq 1 ]; then
    mkdir $1
    chmod 777 $1 
    cd $1
    npm init -y
    # グローバルでインストールできないみたい？のため、別途入れる。
    npm i -S @types/node
    touch tsconfig.json
    cat << CNF >> tsconfig.json
{
    "compilerOptions": {
      "module": "commonjs",
      "target": "es2017",
      "sourceMap": true,
      "types" : ["node"]
    },
    "exclude": [
      "node_modules"
    ]
}
CNF

else
    echo "no param"
fi