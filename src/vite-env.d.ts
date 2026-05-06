/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_POSTHOG_KEY: string;
    readonly VITE_PUBLIC_POSTHOG_HOST: string;
}

declare module '*.css' {
    const content: string;
    export default content;
}
