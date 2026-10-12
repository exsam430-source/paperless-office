export const getServerBaseUrl = () =>
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'http://localhost:5000';

// ✅ Add cache-busting for PDFs to prevent browser caching signed documents
export const getUploadUrl = (filename, cacheBust = true) => {
  if (!filename) return '';
  
  const baseUrl = getServerBaseUrl();
  const url = `${baseUrl}/uploads/${filename}`;
  
  // Add timestamp to prevent caching for PDFs (so signed versions load properly)
  if (cacheBust && filename.toLowerCase().endsWith('.pdf')) {
    return `${url}?t=${Date.now()}`;
  }
  
  return url;
};