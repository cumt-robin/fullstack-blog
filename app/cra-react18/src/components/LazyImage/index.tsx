import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import defaultImg from "@/assets/img/default.png";

interface LazyImageProps {
    src: string;
    alt?: string;
    placeholder?: string;
    threshold?: number;
}

type ExtraProps = Omit<React.HTMLAttributes<HTMLImageElement>, keyof LazyImageProps>;

const LazyImage: React.FC<LazyImageProps & ExtraProps> = ({ src, alt, placeholder = defaultImg, threshold = 0.1, ...restAttrs }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);
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

    return <img {...restAttrs} ref={imgRef} src={isInView && isLoaded ? src : placeholder} alt={alt} />;
};

export default styled(LazyImage)``;
