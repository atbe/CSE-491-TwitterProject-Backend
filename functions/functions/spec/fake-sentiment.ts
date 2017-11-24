import * as mock from 'mock-require';

const fakeSentiment = {
    getSentiment(document): any {
        return {
            score: 1
        }
    }
};

export function init() {
  mock('../src/sentiment', fakeSentiment);
}
