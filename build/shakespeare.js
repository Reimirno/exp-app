var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { formatError, logError, logSuccess } from "./log.js";
export var FunLanguage;
(function (FunLanguage) {
    FunLanguage["shakespeare"] = "shakespeare";
    FunLanguage["oldEnglish"] = "oldenglish";
    FunLanguage["pigLatin"] = "pig-latin";
})(FunLanguage || (FunLanguage = {}));
export class TranslationResponse {
    constructor(translated, original, translation) {
        this.translated = translated;
        this.original = original;
        this.translation = translation;
    }
}
export const translateFun = (text, funType) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios
        .post(`https://api.funtranslations.com/translate/${funType.toString()}.json`, {
        text: text,
    })
        .then(function (response) {
        const data = response.data;
        if (typeof data.success === "undefined" || data.success.total <= 0) {
            logError(`Translation failed.`);
            return undefined;
        }
        logSuccess("Translation succeeded.");
        console.log("Original: " + data.contents.text);
        console.log("After: " + data.contents.translated);
        return new TranslationResponse(data.contents.translated, data.contents.text, data.contents.translation);
    })
        .catch(function (error) {
        if (error.response) {
            logError("Translation Failed. Server responded with a status code that falls out of the range of 2xx.");
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        else if (error.request) {
            logError("Translation Failed. The request was made but no response was received.");
            console.log(error.request);
        }
        else {
            console.log(formatError("Translation Failed.\n") + error.message);
        }
        return undefined;
    });
});
//# sourceMappingURL=shakespeare.js.map