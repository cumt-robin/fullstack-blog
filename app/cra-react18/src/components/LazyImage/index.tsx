import React, { useState, useEffect, useRef } from "react";

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder: string;
    threshold?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, placeholder, threshold = 0.1 }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observerRef.current!.disconnect();
                }
            },
            { threshold },
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold]);

    useEffect(() => {
        if (!isInView) return;

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setIsLoaded(true);
        };

        return () => {
            img.onload = null;
        };
    }, [isInView, src]);

    return <div ref={imgRef}>{isInView && isLoaded ? <img src={src} alt={alt} /> : <img src={placeholder} alt={alt} />}</div>;
};

export default LazyImage;
