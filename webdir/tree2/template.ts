// テンプレート読み込み、アサイン用クラス

import * as ejs from 'ejs';
import * as fs from 'fs';

export class Template {
    public getTemplate(tempPath: string) {
        return fs.readFileSync(tempPath, 'utf-8');
    }

    public assign(templateData: string, assign :object): any{
        return ejs.render(templateData, assign);
    }

}