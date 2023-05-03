export const regExpInitBootstrap = /init\((.|\n)*?\)/;
export const regExURL =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

export async function sha256(message: string) {
  try {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(">>> crypto.js - sha256: can not calculate a hash", err);
    return "";
  }
}
