// Supabase configuration - uses environment variables in production
// Safe access to import.meta.env
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    return import.meta?.env?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const projectId = getEnvVar('VITE_SUPABASE_PROJECT_ID', 'mwogpzhixkcrxwhvxdgc');
export const publicAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2dwemhpeGtjcnh3aHZ4ZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTc3NjIsImV4cCI6MjA3NzUzMzc2Mn0.YFY4Wg2UxXBuPXIy9jWrcDCfmMo2rYBgxKz-wSHnD2E');