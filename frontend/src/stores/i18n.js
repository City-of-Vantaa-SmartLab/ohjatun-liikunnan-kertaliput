import content from './content.json';
import { observable, computed, makeObservable } from 'mobx';

// this is a store of worded content, for internationalization
class I18NStore {
    language = 'fi';

    constructor() {
        makeObservable(this, {
            language: observable,
            content: computed,
        });
    }

    get content() {
        switch (this.language.toLowerCase()) {
            case 'sv':
                return content.swedish;
            case 'en':
                return content.english;
            default:
                return content.finnish;
        }
    }
}

export default I18NStore;
