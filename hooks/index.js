import { useEffect, useState } from "react";

/**
 * Judge whether to show wallet connect/pay logic
 * @returns 
 */
export const useShowConnect = () => {
    const [isShowConnect, setIsShowConnect] = useState(false);
    useEffect(() => {
        // In Foxwallet webview, the useragent seems like the following:
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 FoxWallet/5.0.3 Safari/605.1"
        const ua = window.navigator.userAgent;
        if (ua.includes('FoxWallet')) {
            setIsShowConnect(true);
        } else {
            setIsShowConnect(false);
        }

    }, [])

    return [isShowConnect, setIsShowConnect]
}