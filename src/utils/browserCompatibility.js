// Browser compatibility utilities and polyfills

// Feature detection utilities
export const browserSupport = {
  // Check for CSS Grid support
  cssGrid: () => {
    return CSS.supports('display', 'grid');
  },

  // Check for CSS Flexbox support
  flexbox: () => {
    return CSS.supports('display', 'flex');
  },

  // Check for CSS Custom Properties support
  customProperties: () => {
    return CSS.supports('--test', 'red');
  },

  // Check for Intersection Observer API
  intersectionObserver: () => {
    return 'IntersectionObserver' in window;
  },

  // Check for Web Audio API
  webAudio: () => {
    return 'AudioContext' in window || 'webkitAudioContext' in window;
  },

  // Check for MediaRecorder API
  mediaRecorder: () => {
    return 'MediaRecorder' in window;
  },

  // Check for getUserMedia API
  getUserMedia: () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },

  // Check for Fetch API
  fetch: () => {
    return 'fetch' in window;
  },

  // Check for Promise support
  promises: () => {
    return 'Promise' in window;
  },

  // Check for ES6 modules support
  modules: () => {
    return 'noModule' in HTMLScriptElement.prototype;
  },

  // Check for WebP image format support
  webp: () => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  // Check for AVIF image format support
  avif: () => {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }
};

// Browser detection
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
  const isEdge = /Edg/.test(userAgent);
  const isIE = /MSIE|Trident/.test(userAgent);
  const isOpera = /OPR/.test(userAgent);

  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isIE,
    isOpera,
    name: isChrome ? 'Chrome' : 
          isFirefox ? 'Firefox' : 
          isSafari ? 'Safari' : 
          isEdge ? 'Edge' : 
          isIE ? 'Internet Explorer' : 
          isOpera ? 'Opera' : 'Unknown'
  };
};

// Polyfills and fallbacks
export const polyfills = {
  // Intersection Observer polyfill
  intersectionObserver: () => {
    if (!browserSupport.intersectionObserver()) {
      // Simple fallback for intersection observer
      window.IntersectionObserver = class {
        constructor(callback) {
          this.callback = callback;
          this.elements = new Set();
        }
        
        observe(element) {
          this.elements.add(element);
          // Immediately trigger callback for fallback
          this.callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: 1
          }]);
        }
        
        unobserve(element) {
          this.elements.delete(element);
        }
        
        disconnect() {
          this.elements.clear();
        }
      };
    }
  },

  // Fetch polyfill for older browsers
  fetch: () => {
    if (!browserSupport.fetch()) {
      // Simple XMLHttpRequest fallback
      window.fetch = (url, options = {}) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options.method || 'GET', url);
          
          if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
              xhr.setRequestHeader(key, value);
            });
          }
          
          xhr.onload = () => {
            resolve({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
              text: () => Promise.resolve(xhr.responseText)
            });
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(options.body);
        });
      };
    }
  },

  // Promise polyfill
  promises: () => {
    if (!browserSupport.promises()) {
      // Basic Promise implementation
      window.Promise = class {
        constructor(executor) {
          this.state = 'pending';
          this.value = undefined;
          this.handlers = [];
          
          const resolve = (value) => {
            if (this.state === 'pending') {
              this.state = 'fulfilled';
              this.value = value;
              this.handlers.forEach(handler => handler.onFulfilled(value));
            }
          };
          
          const reject = (reason) => {
            if (this.state === 'pending') {
              this.state = 'rejected';
              this.value = reason;
              this.handlers.forEach(handler => handler.onRejected(reason));
            }
          };
          
          try {
            executor(resolve, reject);
          } catch (error) {
            reject(error);
          }
        }
        
        then(onFulfilled, onRejected) {
          return new Promise((resolve, reject) => {
            const handler = {
              onFulfilled: (value) => {
                try {
                  const result = onFulfilled ? onFulfilled(value) : value;
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              },
              onRejected: (reason) => {
                try {
                  const result = onRejected ? onRejected(reason) : reason;
                  reject(result);
                } catch (error) {
                  reject(error);
                }
              }
            };
            
            if (this.state === 'fulfilled') {
              handler.onFulfilled(this.value);
            } else if (this.state === 'rejected') {
              handler.onRejected(this.value);
            } else {
              this.handlers.push(handler);
            }
          });
        }
        
        catch(onRejected) {
          return this.then(null, onRejected);
        }
        
        static resolve(value) {
          return new Promise(resolve => resolve(value));
        }
        
        static reject(reason) {
          return new Promise((_, reject) => reject(reason));
        }
      };
    }
  }
};

// CSS fallbacks
export const cssSupport = {
  // Add CSS Grid fallback classes
  addGridFallbacks: () => {
    if (!browserSupport.cssGrid()) {
      document.documentElement.classList.add('no-css-grid');
    }
  },

  // Add Flexbox fallback classes
  addFlexboxFallbacks: () => {
    if (!browserSupport.flexbox()) {
      document.documentElement.classList.add('no-flexbox');
    }
  },

  // Add custom properties fallbacks
  addCustomPropertiesFallbacks: () => {
    if (!browserSupport.customProperties()) {
      document.documentElement.classList.add('no-custom-properties');
    }
  }
};

// Initialize all polyfills and fallbacks
export const initBrowserCompatibility = async () => {
  const browser = detectBrowser();
  
  // Add browser class to html element
  document.documentElement.classList.add(`browser-${browser.name.toLowerCase()}`);
  
  // Initialize polyfills
  polyfills.intersectionObserver();
  polyfills.fetch();
  polyfills.promises();
  
  // Add CSS fallback classes
  cssSupport.addGridFallbacks();
  cssSupport.addFlexboxFallbacks();
  cssSupport.addCustomPropertiesFallbacks();
  
  // Check image format support
  const [webpSupported, avifSupported] = await Promise.all([
    browserSupport.webp(),
    browserSupport.avif()
  ]);
  
  if (webpSupported) {
    document.documentElement.classList.add('webp-supported');
  }
  
  if (avifSupported) {
    document.documentElement.classList.add('avif-supported');
  }
  
  // Log browser compatibility info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser Compatibility Report:', {
      browser: browser.name,
      cssGrid: browserSupport.cssGrid(),
      flexbox: browserSupport.flexbox(),
      customProperties: browserSupport.customProperties(),
      intersectionObserver: browserSupport.intersectionObserver(),
      webAudio: browserSupport.webAudio(),
      mediaRecorder: browserSupport.mediaRecorder(),
      getUserMedia: browserSupport.getUserMedia(),
      fetch: browserSupport.fetch(),
      promises: browserSupport.promises(),
      webp: webpSupported,
      avif: avifSupported
    });
  }
  
  return {
    browser,
    support: {
      cssGrid: browserSupport.cssGrid(),
      flexbox: browserSupport.flexbox(),
      customProperties: browserSupport.customProperties(),
      intersectionObserver: browserSupport.intersectionObserver(),
      webAudio: browserSupport.webAudio(),
      mediaRecorder: browserSupport.mediaRecorder(),
      getUserMedia: browserSupport.getUserMedia(),
      fetch: browserSupport.fetch(),
      promises: browserSupport.promises(),
      webp: webpSupported,
      avif: avifSupported
    }
  };
};

// Media query helpers for responsive design
export const mediaQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  
  // Check if media query matches
  matches: (query) => {
    return window.matchMedia(query).matches;
  },
  
  // Add listener for media query changes
  addListener: (query, callback) => {
    const mq = window.matchMedia(query);
    mq.addListener(callback);
    return mq;
  }
};

// Performance optimization helpers
export const performance = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Check connection quality
  getConnectionQuality: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  },
  
  // Optimize based on device capabilities
  shouldOptimizeForLowEnd: () => {
    const connection = performance.getConnectionQuality();
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    return isLowEndDevice || isSlowConnection || (connection && connection.saveData);
  }
};
