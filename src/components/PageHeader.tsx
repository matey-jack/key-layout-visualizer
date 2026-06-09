interface PageHeaderProps {
    title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
    return (
        <div style="position: relative;">
            <h1>{title}</h1>
            <a href="https://github.com/matey-jack/key-layout-visualizer"
               style="position: absolute; top: 0; right: 0; text-decoration: none;">
                <img src="github-logo.svg" alt="Link to source code." />
            </a>
        </div>
    );
}
