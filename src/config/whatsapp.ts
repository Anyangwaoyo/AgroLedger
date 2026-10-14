/**
 * AgroLedger WhatsApp Configuration
 * Centralized settings for the WhatsApp Business click-to-chat access.
 */

export interface WhatsAppConfig {
  /**
   * Nigerian international phone format without '+' or spaces (for wa.me URL)
   * Configured business number: 2347030881613
   */
  businessPhoneNumber: string;
  displayPhoneNumber: string;
  defaultPrefilledMessage: string;
  helperText: string;
}

export const WHATSAPP_CONFIG: WhatsAppConfig = {
  businessPhoneNumber: '2347030881613',
  displayPhoneNumber: '+234 703 088 1613',
  defaultPrefilledMessage: 'Hello AgroLedger, I want to record a transaction.',
  helperText: 'Record transactions easily through WhatsApp.',
};

/**
 * Builds the official WhatsApp click-to-chat URL
 * Format: https://wa.me/<number>?text=<encoded_text>
 */
export function buildWhatsAppChatUrl(customText?: string): string {
  const number = WHATSAPP_CONFIG.businessPhoneNumber.trim();
  const text = customText !== undefined ? customText : WHATSAPP_CONFIG.defaultPrefilledMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
