import { useEffect, useState } from "react";
import { isMobile } from '@/utils';

/**
 * Judge whether to show wallet connect/pay logic
 * @returns 
 */
export const useShowConnect = () => {
    const [isShowConnect, setIsShowConnect] = useState(false);
    useEffect(() => {
        if (isMobile()) {
            setIsShowConnect(true);
        } else {
            setIsShowConnect(false);
        }

    }, [])

    return [isShowConnect, setIsShowConnect]
}