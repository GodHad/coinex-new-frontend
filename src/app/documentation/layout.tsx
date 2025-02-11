const DocumentationLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">{children}</div>
        </div>
    )
}

export default DocumentationLayout;