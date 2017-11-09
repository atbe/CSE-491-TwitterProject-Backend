var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();
// const languageClient = new language.LanguageServiceClient({
//     keyFilename: '../../TwitterTweetTracker-93ade215aff3.json'
// });
exports.getSentiment = function (document) {
    return __awaiter(this, void 0, void 0, function* () {
        return languageClient.analyzeSentiment({ document: document }).then((results) => {
            return results[0].documentSentiment;
        }, (err) => {
            console.error(`Error while analyzing sentiment for reply: ${err}`);
        });
    });
};
//# sourceMappingURL=sentiment.js.map