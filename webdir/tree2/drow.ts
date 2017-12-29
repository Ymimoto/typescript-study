/**
 * 描画計算および出力データ作成用クラス
 */

import {DrowStr} from "./drowStr";

export class Drow {
    private startBallPos;
    private starList;
    private dispFlg;
    private drowString;

    constructor(dot = "▲"){
        this.startBallPos = 2;
        this.starList = [];
        this.dispFlg = true;
        this.drowString = new DrowStr();
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