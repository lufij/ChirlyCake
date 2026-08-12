import { useEffect } from 'react';

export function PWAHead() {
  useEffect(() => {
    // Agregar los meta tags necesarios para PWA
    const head = document.head;

    // Manifest
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    head.appendChild(manifestLink);

    // Theme color
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#ec4899';
    head.appendChild(themeColorMeta);

    // Apple Touch Icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icons/icon-192x192.png';
    head.appendChild(appleTouchIcon);

    // Apple Mobile Web App Capable
    const appleCapableMeta = document.createElement('meta');
    appleCapableMeta.name = 'apple-mobile-web-app-capable';
    appleCapableMeta.content = 'yes';
    head.appendChild(appleCapableMeta);

    // Apple Mobile Web App Status Bar Style
    const appleStatusBarMeta = document.createElement('meta');
    appleStatusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusBarMeta.content = 'black-translucent';
    head.appendChild(appleStatusBarMeta);

    // Apple Mobile Web App Title
    const appleTitleMeta = document.createElement('meta');
    appleTitleMeta.name = 'apple-mobile-web-app-title';
    appleTitleMeta.content = 'Pastelería';
    head.appendChild(appleTitleMeta);

    // Mobile Web App Capable (para Android)
    const mobileCapableMeta = document.createElement('meta');
    mobileCapableMeta.name = 'mobile-web-app-capable';
    mobileCapableMeta.content = 'yes';
    head.appendChild(mobileCapableMeta);

    // Viewport para asegurar responsive
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');

    // Cleanup function
    return () => {
      head.removeChild(manifestLink);
      head.removeChild(themeColorMeta);
      head.removeChild(appleTouchIcon);
      head.removeChild(appleCapableMeta);
      head.removeChild(appleStatusBarMeta);
      head.removeChild(appleTitleMeta);
      head.removeChild(mobileCapableMeta);
    };
  }, []);

  return null;
}
