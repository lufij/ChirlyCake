/**
 * Safely copy text to clipboard with fallback for when Clipboard API is blocked
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (silently fail if blocked)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Silently fall through to fallback method
      // The Clipboard API is often blocked in embedded contexts or iframes
    }
  }

  // Fallback method using textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    
    // For iOS compatibility
    textarea.contentEditable = 'true';
    textarea.readOnly = false;
    
    // Select the text
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      // iOS specific selection
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }
    
    // Execute copy command
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (!successful) {
      throw new Error('execCommand copy failed');
    }
    
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
  }
}