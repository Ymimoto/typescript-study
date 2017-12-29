// メインクラス
// treeを参考に、機能向上させたり見やすくモジュールで管理しやすく作成する。
// httpやsocket.ioあたりは、やりにくいというのもあって
// 単純なやつならクラス化せずにここで宣言/使用しても問題ないような気がする。
// todo: あとで、treeのほうもこっちに揃えて改修する
// 今回は処理が複雑なので、chromeでデバッグする拡張を入れた
// npm install -g ts-node

import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as socketIo from 'socket.io';
import {Template} from './template';
import {Drow} from './drow'

class Main {
    private server;
    private io;
    private writeHeight;
    private drowArray;

    constructor(){
        this.writeHeight = 7;
        this.drowArray = [];

        // 本当は新しくhtmlおよびsocket.ioの制御用クラスを作成し、
        // 設定記載したメソッドのオブジェクトを渡してデータ受信時の動作を設定したいのだが、
        // うまくいかない。もどかしい。
        // this.httpClass = new Http();
        // this.httpClass.initServer();
        // this.socketIoClass.initSocket(this.httpClass.server);
        // this.socketIoClass.setConnection(this.initTree);

        this.initServer();
        console.log("待ち受け開始");
    }

    private initServer(){
        var server = http.createServer((req,res) => this.startServer(req,res));
        server.listen(3000);

        var io = socketIo.listen(server);
        io.sockets.on("connection",function(socket){
            io.sockets.emit('startMsg',　{'msg': '接続開始'});
            var template = new Template();
            var drow = new Drow();
            var tmpltSub = template.getTemplate('./treeSub.ejs');
    
            // 2秒ごとに更新する
            setInterval(function(){
                console.log("描画更新");
                this.drowArray = drow.drowLineArray(this.writeHeight);
                let treeSub = template.assign(tmpltSub, {'drowArray': this.drowArray});
                io.sockets.emit('setUpdateTree', {'drowTags':treeSub});
            }, 2000);
    
            socket.on('getUpdateTree', function(data){
                // 引数に渡された値で強制ツリー更新
                console.log("描画数更新");
                this.writeHeight = data.writeHeight;
                this.drowArray = drow.drowLineArray(this.writeHeight);
                let treeSub = template.assign(tmpltSub, {'drowArray': this.drowArray});
                io.sockets.emit('setUpdateTree', {'drowTags':treeSub});
            });
    
            socket.on('disconnect',function(){
                console.log('socket.io 接続終了');
                //io.sockets.emit('startMsg',　{'msg': '接続終了'});
            });

        });


        console.log("http稼働開始");
    }

    private startServer(req, res): void{
        let getParam = url.parse(req.url, true);
        // socket.io等の読み込みで引っかかってしまうため回避する
        if(getParam.path != "/socket.io/socket.io.js" && getParam.path != "/json" && getParam.path != "/json/version" ){
            fs.access("./" + getParam.path + ".ejs", (e) => {
                if(e){
                    console.log("404 error!! path:"+getParam.path);
                    res.writeHead(404, {'Content-Type' : 'text/plain'});
                    res.write("404 error!!");
                    res.end();
                }else{
                    let template = new Template(),
                        tmplt = template.getTemplate("./"+getParam.path+".ejs"),
                        html = template.assign(tmplt, {});
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(html);
                    res.end();
                }
            });
        }else{
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end();
        }
    }

    private initSocket(){


    }
}

const main = new Main();