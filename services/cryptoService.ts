import CryptoJS from "crypto-js";

// Chave e salt padrão para criptografia AES em repouso dos dados no cliente
const STORAGE_CIPHER_KEY = "notacerta-pe-gov-crypto-2026-v1";

export const cryptoService = {
  /**
   * Criptografa uma string em texto puro usando AES (Advanced Encryption Standard).
   * Retorna a string cifrada em formato Base64 OpenSSL-compatible (iniciando em U2FsdGVkX1...).
   */
  encrypt(plainText: string): string {
    if (!plainText || typeof plainText !== "string") return "";
    try {
      return CryptoJS.AES.encrypt(plainText, STORAGE_CIPHER_KEY).toString();
    } catch {
      return plainText;
    }
  },

  /**
   * Decifra uma string cifrada com AES.
   * Se a string não estiver cifrada (ex.: dados legados em JSON bruto), retorna o próprio texto com segurança.
   */
  decrypt(cipherText: string): string {
    if (!cipherText || typeof cipherText !== "string") return "";
    const trimmed = cipherText.trim();
    // Padrão de identificação de string cifrada por CryptoJS (OpenSSL salt header 'Salted__')
    if (!trimmed.startsWith("U2FsdGVkX1")) {
      return trimmed;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(trimmed, STORAGE_CIPHER_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || trimmed;
    } catch {
      return trimmed;
    }
  },

  /**
   * Varre e elimina sumariamente todos os cookies do navegador para qualquer caminho ou domínio.
   */
  purgeAllCookies(): void {
    if (typeof document === "undefined") return;
    try {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (!name) continue;
        // Expira o cookie no passado na raiz e variações de caminho
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=;`;
        if (typeof window !== "undefined" && window.location.hostname) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        }
      }
    } catch {
      // Ignora falhas de limpeza silenciosamente
    }
  },
};
