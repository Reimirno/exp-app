import axios, { AxiosResponse } from "axios";
import { formatError, logError, logSuccess } from "./log.js";

export enum FunLanguage {
  shakespeare = "shakespeare",
  oldEnglish = "oldenglish",
  pigLatin = "pig-latin",
}

export class TranslationResponse {
  translated: string;
  original: string;
  translation: string;
  constructor(translated: string, original: string, translation: string) {
    this.translated = translated;
    this.original = original;
    this.translation = translation;
  }
}

export const translateFun = async (
  text: string,
  funType: FunLanguage
): Promise<TranslationResponse | undefined> => {
  return await axios
    .post(
      `https://api.funtranslations.com/translate/${funType.toString()}.json`,
      {
        text: text,
      }
    )
    .then(function (response: AxiosResponse) {
      const data: any = response.data;
      if (typeof data.success === "undefined" || data.success.total <= 0) {
        logError(`Translation failed.`);
        return undefined;
      }
      logSuccess("Translation succeeded.");
      console.log("Original: " + data.contents.text);
      console.log("After: " + data.contents.translated);
      return new TranslationResponse(
        data.contents.translated,
        data.contents.text,
        data.contents.translation
      );
    })
    .catch(function (error) {
      if (error.response) {
        logError(
          "Translation Failed. Server responded with a status code that falls out of the range of 2xx."
        );
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        logError(
          "Translation Failed. The request was made but no response was received."
        );
        console.log(error.request);
      } else {
        console.log(formatError("Translation Failed.\n") + error.message);
      }
      return undefined;
    });
};
