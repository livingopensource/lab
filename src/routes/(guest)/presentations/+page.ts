export const ssr = false

export async function load({url}) {
    if (url.searchParams.get('preview') != null) {
        const response = await fetch(`https://raw.githubusercontent.com/livingopensource/presentations/refs/heads/main/${url.searchParams.get('preview')}`)
        const html = await response.text()
        return { html }
    }
    const response = await fetch('https://raw.githubusercontent.com/livingopensource/presentations/refs/heads/main/src/index.html')
    const html = await response.text()
    return { html }
}