export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

export function openApp() {
    const url = {
        open: 'foxwallet://',
        download: 'https://foxwallet.com'
    };
    location.href = url.open;
    const iframe = document.createElement('iframe');
    const body = document.body;
    iframe.style.cssText = 'display:none;width=0;height=0';
    let timer = null;
    body.appendChild(iframe);
    iframe.src = url.open;
    timer = setTimeout(function () {
        location.href = url.download;
    }, 500);
}
