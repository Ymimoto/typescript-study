# typescript-study
typescriptの勉強結果。ついでにNode.jsも覚えよう。

### ディレクトリ内訳
基本的に、○○○がnode.jsオンリーで、○○○2がtypescriptで書き直したやつ。

- webdir
    - hello よくあるハローワールド
    - hello2 helloをtypescriptで書き直したもの
    
    - tree クリスマスが近かったので、ツリーを作ってみたもの。socket.idでツリーの高さを動的に買えるようにしてみたけど、まだ改良の余地がありそう。
    - tree2 treeをtypescriptで書き直して改良を加えたもの……だったのだがうまくいっていない。socket.ioがうまく処理できていない。改良した箇所が怪しい。

### Todo(ソースに書いていないもの)
- tree2がうまくいかない理由として、存在しないテンプレートを呼んだときに404を返すようにした改良が邪魔をしていると思われる。
いっそのこと、http箇所はnginxで動作させる等して分担させたい。(勉強にもなる)
- データベース連携したものを作ってみたい。(チャット等)
- クライアント側jsとしてAngularJS等も触ってみようかな……

### 参考にしたサイト
- http://www.geocities.jp/m_hiroi/light/typescript.html
- https://ics.media/entry/4682
- https://ics.media/entry/4320
