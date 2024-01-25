export { displayError };
import { errorMsgEl } from "./const.js";

const displayError = (errorMessage) => {
  if (errorMessage) console.warn(errorMessage);

  errorMsgEl.textContent = errorMessage;
};
