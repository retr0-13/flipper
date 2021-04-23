(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{126:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return p})),n.d(t,"default",(function(){return s}));var r=n(3),i=n(7),o=(n(0),n(159)),a=n(160),c={id:"arch",title:"Architecture"},l={unversionedId:"extending/arch",id:"extending/arch",isDocsHomePage:!1,title:"Architecture",description:"Flipper is built to be a universal pluggable platform for development tools. Currently, Flipper focuses on Android and iOS development, but its design does not limit it to these platforms. Another way to think of Flipper is a more general-purpose implementation of Chrome DevTools.",source:"@site/../docs/extending/architecture.mdx",slug:"/extending/arch",permalink:"/docs/extending/arch",editUrl:"https://github.com/facebook/flipper/blob/master/website/../docs/extending/architecture.mdx",version:"current",sidebar:"extending",previous:{title:"Error Handling",permalink:"/docs/extending/error-handling"},next:{title:"Client Plugin Lifecycle",permalink:"/docs/extending/client-plugin-lifecycle"}},p=[{value:"Overview",id:"overview",children:[]},{value:"Architecture - React Native",id:"architecture---react-native",children:[]}],u={toc:p};function s(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Flipper is built to be a universal pluggable platform for development tools. Currently, Flipper focuses on Android and iOS development, but its design does not limit it to these platforms. Another way to think of Flipper is a more general-purpose implementation of Chrome DevTools."),Object(o.b)("h3",{id:"overview"},"Overview"),Object(o.b)("p",null,"Flipper consists of a desktop interface built with javascript on top of Electron so that it can be packaged to run on any operating system."),Object(o.b)("p",null,"This desktop app connects over a ",Object(o.b)("a",{parentName:"p",href:"establishing-a-connection"},"tcp connection")," to applications running on simulators and connected devices. An application running on a device or simulator is what we refer to as a client."),Object(o.b)("p",null,"The connection is bi-directional, allowing the desktop to query information from the client as well as the client to push updates directly to the desktop."),Object(o.b)("p",null,"By querying data and responding to pushing from the client, a Flipper plugin is able to visualize data, debug problems, and change the behavior of running applications. Flipper provides the platform to build these tools on top of and does not limit what kind of tools that may be.\nThere are two kinds of plugins in Flipper, client plugins and desktop plugins. Client plugins expose information as an API to desktop plugins whose responsibility it is to render this information in an easy-to-digest way. Client plugins are written once for each platform in the platform's native language. Desktop plugins are written only once in JavaScript using React and consume the APIs exposed by the client plugins."),Object(o.b)("h3",{id:"architecture---react-native"},"Architecture - React Native"),Object(o.b)("p",null,"Simplified visualization of Flipper architecture, when used with React Native."),Object(o.b)("img",{alt:"Flipper communication diagram",src:Object(a.a)("img/flipper-communication-diagram.png")}))}s.isMDXComponent=!0},159:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return b}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=i.a.createContext({}),u=function(e){var t=i.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=u(e.components);return i.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},f=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,a=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=u(n),f=r,b=s["".concat(a,".").concat(f)]||s[f]||d[f]||o;return n?i.a.createElement(b,c(c({ref:t},p),{},{components:n})):i.a.createElement(b,c({ref:t},p))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=f;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var p=2;p<o;p++)a[p]=n[p];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},160:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return a}));var r=n(10),i=n(161);function o(){var e=Object(r.default)().siteConfig,t=(e=void 0===e?{}:e).baseUrl,n=void 0===t?"/":t,o=e.url;return{withBaseUrl:function(e,t){return function(e,t,n,r){var o=void 0===r?{}:r,a=o.forcePrependBaseUrl,c=void 0!==a&&a,l=o.absolute,p=void 0!==l&&l;if(!n)return n;if(n.startsWith("#"))return n;if(Object(i.b)(n))return n;if(c)return t+n;var u=n.startsWith(t)?n:t+n.replace(/^\//,"");return p?e+u:u}(o,n,e,t)}}}function a(e,t){return void 0===t&&(t={}),(0,o().withBaseUrl)(e,t)}},161:function(e,t,n){"use strict";function r(e){return!0===/^(\w*:|\/\/)/.test(e)}function i(e){return void 0!==e&&!r(e)}n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return i}))}}]);