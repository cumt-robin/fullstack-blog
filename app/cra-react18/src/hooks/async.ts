/**
 * @author: Tusi
 * @description: 异步 Hook，用于 loading, error 等状态反馈
 */
import { useCallback, useState } from "react";
import { GeneralFunction } from "@/bean/base";

interface AsyncLoadingResponse {
    trigger: GeneralFunction;
    loading: boolean;
    isError: boolean;
    error: unknown;
}

export const useAsyncLoading = (fn: GeneralFunction<Promise<unknown>>): AsyncLoadingResponse => {
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<unknown>();
    const trigger = useCallback(async (...args: any[]) => {
        try {
            setLoading(true);
            await fn(...args);
        } catch (err) {
            setIsError(true);
            setError(err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { trigger, loading, isError, error };
};