import { allowedOrigins } from './allowedOrigins';
const scriptTag = document.currentScript as HTMLScriptElement | null;

let tk = scriptTag?.getAttribute("tk") || 'MVINbTAdbz86JcLYi62TuIHGv6AdHvQcbVQSCDRcs877vu6F2sGUrBUZJjg19Do4YWvbzIaH6ZGZ4rakJzdyeGc9PQ..'
// Custom Base64 obfuscator

// Function to fetch widget configuration
const fetchWidgetConfig = async () => {
  try {
    const response = await fetch(`https://theconnexus.ai/api/widgets/foundPhrase`, {
      headers: {
        'Content-Type': 'application/json',
        'x-widget-token': tk
      }
    });
    // console.log(response);
    if (!response.ok) {
      throw new Error('Failed to fetch widget configuration');
    }
    // console.log(response,'response.data')
    return await response.json();
  
  } catch (error) {
    console.error('Error fetching widget configuration:', error);
    // Return default configuration if fetch fails
    return {}
  }
};

// Initialize widget configuration
let widgetConfig: any = null;

// Function to initialize the configuration
export const initializeWidgetConfig = async () => {
  if (!widgetConfig) {
    widgetConfig = await fetchWidgetConfig();
  }
  return widgetConfig.data;
};

// Export the configuration getter
export const getWidgetConfig = () => {
  console.log(widgetConfig);
  if (!widgetConfig) {
    throw new Error('Widget configuration not initialized.');
  }
  return widgetConfig.data;
};
export const Key = '1b07e2d1-c19f-44de-a638-303e755e1477'

// Export allowed origins
export { allowedOrigins };