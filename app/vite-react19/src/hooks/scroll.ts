import { useCallback, useEffect } from "react";

interface UseScrollBottomProps {
    ref: React.RefObject<HTMLElement>;
    onBottomReached: () => void;
    offset?: number;
    disabled?: boolean;
}

export const useScrollBottom = (options: UseScrollBottomProps) => {
    const { ref, onBottomReached, offset = 50, disabled = false } = options;

    const handleScroll = useCallback(() => {
        if (ref.current && !disabled) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            if (scrollTop + clientHeight >= scrollHeight - offset) {
                onBottomReached();
            }
        }
    }, [ref, onBottomReached, offset, disabled]);

    useEffect(() => {
        const currentElement = ref.current;
        if (currentElement) {
            currentElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (currentElement) {
                currentElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [ref, handleScroll]);
};
