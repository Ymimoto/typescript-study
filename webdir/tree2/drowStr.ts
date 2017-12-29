/**
 * 指定された文字を出力するクラス
 */
export class DrowStr {
    private dot;
    private stem;
    private star1;
    private star2;
    private ball1;
    private ball2;

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