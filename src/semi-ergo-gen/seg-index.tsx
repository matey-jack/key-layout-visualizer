import { render } from 'preact'
import posthog from 'posthog-js'
import { SegApp } from './seg-app.tsx'

if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    });
}

render(<SegApp />, document.getElementById('app')!);


