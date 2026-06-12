import { render } from 'preact'
import posthog from 'posthog-js'
import { SemiErgoApp } from './se-app.tsx'

if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    });
}

render(<SemiErgoApp />, document.getElementById('app')!);


