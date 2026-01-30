import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        let { repoId } = body // repoId can now be a URL or ID

        if (!repoId) {
            return NextResponse.json(
                { error: 'Repository ID or URL is required' },
                { status: 400 }
            )
        }

        repoId = repoId.trim()

        // --- GITHUB HANDLING ---
        if (repoId.includes('github.com')) {
            // Extract owner/repo
            // Support: https://github.com/owner/repo, https://github.com/owner/repo.git, or just github.com/owner/repo
            const match = repoId.match(/github\.com\/([^\/]+)\/([^\/\.]+)/)
            if (!match) {
                return NextResponse.json({ error: 'Invalid GitHub URL format' }, { status: 400 })
            }

            const owner = match[1]
            const repo = match[2]
            const fullName = `${owner}/${repo}`

            // 1. Fetch Repo Metadata
            const metadataResponse = await fetch(`https://api.github.com/repos/${fullName}`)
            if (!metadataResponse.ok) {
                return NextResponse.json({ error: 'GitHub repository not found' }, { status: 404 })
            }
            const metadata = await metadataResponse.json()

            // 2. Fetch README (Raw)
            // Try HEAD first
            const readmeResponse = await fetch(`https://raw.githubusercontent.com/${fullName}/HEAD/README.md`)
            let readme = readmeResponse.ok ? await readmeResponse.text() : (metadata.description || 'No description provided.')

            // Strip YAML Frontmatter
            readme = readme.replace(/^---\n[\s\S]*?\n---\n/, '')

            return NextResponse.json({
                name: metadata.name,
                tagline: metadata.description || `Open source project by ${owner}`,
                description: readme,
                url: metadata.html_url,
                // Extra metadata if needed: stars: metadata.stargazers_count, language: metadata.language
            })
        }

        // --- HUGGING FACE HANDLING ---
        else {
            // Handle full HF URLs too: https://huggingface.co/TheBloke/Mistral... -> TheBloke/Mistral...
            const cleanId = repoId.replace('https://huggingface.co/', '').split('/tree/')[0] // simplistic cleaner

            // 1. Fetch Model Metadata
            const metadataResponse = await fetch(`https://huggingface.co/api/models/${cleanId}`)

            if (!metadataResponse.ok) {
                // Try dataset? For now assume model.
                return NextResponse.json(
                    { error: 'Repository not found on Hugging Face' },
                    { status: 404 }
                )
            }

            const metadata = await metadataResponse.json()

            // 2. Fetch README
            let readmeResponse = await fetch(`https://huggingface.co/${cleanId}/resolve/main/README.md`)
            if (!readmeResponse.ok) {
                readmeResponse = await fetch(`https://huggingface.co/${cleanId}/resolve/master/README.md`)
            }

            let readme = readmeResponse.ok ? await readmeResponse.text() : ''

            // Strip YAML Frontmatter
            readme = readme.replace(/^---\n[\s\S]*?\n---\n/, '')

            return NextResponse.json({
                name: metadata.id.split('/').pop() || metadata.id,
                tagline: `Hugging Face model: ${metadata.pipeline_tag || 'AI Model'} by ${metadata.author || metadata.id.split('/')[0]}`,
                description: readme || 'No README available.',
                url: `https://huggingface.co/${cleanId}`,
            })
        }

    } catch (error) {
        console.error('Ingest Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
