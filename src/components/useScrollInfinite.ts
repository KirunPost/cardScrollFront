import { useEffect } from "react";

export function useScrollInfinite(callback: () => void) {

    useEffect(() => {
        const windowScroll = () => {
            if ((window.pageYOffset + window.innerHeight + 100) >= document.body.clientHeight) {
                callback();
            }
        };

        window.addEventListener("scroll", windowScroll);
        return () => {
            window.removeEventListener("scroll", windowScroll);
        };
    }, [callback]);
}