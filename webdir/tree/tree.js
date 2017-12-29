// クラスを使って、さらにhtmlテンプレートを読み込んで表示してみる
// テンプレートはejsを使用。
// npm install ejs
// npm install socket.io
// 実際に開発する場合はexpressでフレームワークごと導入したほうがよさそう。

/**
 * 描画計算および出力データ作成用クラス
 */
class drow {
    constructor(dot = "▲"){
        this.startBallPos = 2;
        this.starList = [];
        this.dispFlg = true;
        this.drowString = new drowStr();
    }

    // 描画配列を作成する。
    drowLineArray(writeHeight = 7){
        let arry = [],
            pos = 0;
        this.getBallList(writeHeight);
        for(let y = 0; y < writeHeight; y++){
                arry[y] = [];
            for(let x = 0; x <= y; x++){
                arry[y][x] = this.getDrowImage(pos);
                pos++;
            }
        }
        
        if(this.dispFlg){
            this.dispFlg = false;
        }else{
            this.dispFlg = true;
        }

        Array.prototype.push.apply(arry, this.drowStem());

        return arry;
    }

    drowStem(){
        let arry = [];
        //幹のサイズは固定
        for(let y = 0; y < 3; y++){
            arry[y] = [];
            for(let x = 0; x <= 2; x++){
                arry[y][x] = this.drowString.stem;
            }
        }
        return arry;
    }

    getDrowImage(pos){
        if(pos == 0){ //一番目は★にする
            return this.drowString.drowStar(this.dispFlg);
        } else {
            if(this.starList.indexOf(pos) >= 0){
                return this.drowString.drowBall(this.dispFlg);
            }else{
                return this.drowString.drowDot(this.dispFlg);
            }
        }
    }

    //○を表示させる順番のリストを作成
    getBallList(writeCnt){
        let max = 0;
        this.starList[0] = this.startBallPos; //起点は2とする。

        //描画個数を計算
        max = this.AAA(writeCnt);
        for(let i = 1; i < max; i++){
            this.starList[i] = this.starList[i - 1] + (2 + (i % 2)); // 前の順番 + (2 or 3) の順番で表示を切り替える
        }
    }

    AAA(cnt){
        if(cnt != 0){
            return cnt + this.AAA(cnt -1);
        } else {
            return 0;
        }
    }
}

/**
 * 指定された文字を出力するクラス
 */
class drowStr {
    constructor(dot = "▲"){
        this.dot = dot;
        this.stem = "■";
        this.star1 = "★";
        this.star2 = "☆";
        this.ball1 = "○";
        this.ball2 = "●";
    } 

    drowDot(){
        return this.dot;
    }

    drowStar(dispFlg){
        return this.drowToggle(this.star1, this.star2, dispFlg);
    }

    drowBall(dispFlg){
        return this.drowToggle(this.ball1, this.ball2, dispFlg);
    }

    drowToggle(image1, image2, dispFlg){
        // 時間で変更したかったのだが、ラグが発生した場合表示がうまくいかないため、
        // フラグで管理。
        if(dispFlg){
            return image1;
        }else{
            return image2;
        }
    }
}

/**
 * メイン
 */
class Main {
    constructor(){
        var http = require('http'),
        url = require('url'),
        ejs = require('ejs'),
        fs = require('fs'),
        socketIo = require('socket.io'),
        server = http.createServer(),
        tmplt = fs.readFileSync('./tree.ejs', 'utf-8'), //外枠用
        tmpltSub = fs.readFileSync('./treeSub.ejs', 'utf-8'), //内部用(socket.io更新用のために分ける)
        writeHeight = 7,
        drowClass = new drow();

        // WEBサーバ設定
        server.on('request', function(req, res) {
            let drowArray = drowClass.drowLineArray(writeHeight);
            let treeSub = ejs.render(tmpltSub, {'drowArray': []}),
            tree = ejs.render(tmplt, {'area': treeSub, "writeHeight" : writeHeight});
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //日本語は明示的にヘッダで文字コード指定しないといけない模様。
            res.write(tree);
            res.end();
        }).listen(3000);

        // socket.ioの設定
        var io = socketIo.listen(server),
        drowArray = drowClass.drowLineArray(writeHeight);
        io.sockets.on('connection', function(socket){
            console.log('socket.io 接続開始');
            io.sockets.emit('startMsg',　{'msg': '接続開始'});

            // 2秒ごとに更新する
            setInterval(function(){
                console.log("描画更新");
                drowArray = drowClass.drowLineArray(writeHeight);
                let treeSub = ejs.render(tmpltSub, {'drowArray': drowArray}); //内部用のテンプレートでhtmlを作る
                io.sockets.emit('setUpdateTree', {'drowTags':treeSub}); //全体に返す
            }, 2000);

            socket.on('getUpdateTree', function(data){
                // 引数に渡された値で強制ツリー更新
                console.log("描画数更新");
                writeHeight = data.writeHeight;
                drowArray = drowClass.drowLineArray(writeHeight);
                let treeSub = ejs.render(tmpltSub, {'drowArray': drowArray});
                io.sockets.emit('setUpdateTree', {'drowTags':treeSub});
            });

            socket.on('disconnect',function(){
                console.log('socket.io 接続終了');
                //io.sockets.emit('startMsg',　{'msg': '接続終了'});
            });
        });

        console.log("待ち受け開始");
    }
}


var srv = new Main();
