// httpを別クラスにて実装しようとしたものの残骸

import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import {Template} from './template';

export class Http {
    
    public server;

    public initServer(){ // Todo:戻り値の型宣言
        this.server = http.createServer((req,res) => this.startServer(req,res)
    );
    this.server.listen(3000);
        console.log("http稼働開始");
    }

    public startServer(req, res): void{
        let getParam = url.parse(req.url, true);
        if(getParam.path != "/socket.io/socket.io.js" && getParam.path != "/json" && getParam.path != "/json/version" ){ //socket.io等の読み込みで引っかかってしまうため回避する
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
}