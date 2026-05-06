import { render } from 'preact'
import posthog from 'posthog-js'
import { App } from './app.tsx'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
});

render(<App />, document.getElementById('app')!);


