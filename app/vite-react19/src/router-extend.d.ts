// router.d.ts
import 'react-router-dom';

declare module 'react-router-dom' {
    interface NonIndexRouteObject {
        meta?: {
            auth?: boolean;
        };
    }

    interface IndexRouteObject {
        meta?: {
            auth?: boolean;
        };
    }
}
