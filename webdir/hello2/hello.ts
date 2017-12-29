// typescript経由でhellow worldする。
import * as http from 'http';

class Main {
    constructor() {
        // createServer実行時にいっしょにhttp設定ができる模様
        // とはいえ、アロー関数でないとスコープの関係上thisで同クラスのメソッドが呼べない模様
        let server = http.createServer((req, res) => this.setRequest(req, res));
        //webdir/helloと分けるため、ポートは別にする
        server.listen('3100');
        console.log("typescript経由でhello worldしたよ");
    }

    private setRequest(req, res): void{
        // nodejs依存のものについては、同じ書き方で行けそうですね。
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.write('hello world');
        res.end();
    }
}

const main = new Main();