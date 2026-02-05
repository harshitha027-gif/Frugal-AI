import { NextResponse } from 'next/server'

// Keywords to auto-detect efficiency features
const EFFICIENCY_KEYWORDS = [
    'quantization', 'quantized', 'gguf', 'awq', 'gptq', 'exl2', 'hqq',
    'distillation', 'distilled',
    'pruning', 'pruned',
    'sparse', 'sparsity',
    'edge', 'on-device', 'mobile', 'android', 'ios',
    'optimized', 'efficient', 'fast', 'lightweight', 'small'
]

// Permissive Licenses (Allow commercial use/modification)
const OPEN_LICENSES = ['apache-2.0', 'mit', 'bsd-3-clause', 'bsd-2-clause', 'cc-by-4.0', 'openrail', 'openrail++']

export async function POST(req: Request) {
    try {
        const body = await req.json()
        let { repoId } = body

        if (!repoId) {
            return NextResponse.json({ error: 'Repository ID or URL is required' }, { status: 400 })
        }

        repoId = repoId.trim()

        let result: any = {
            analysis: {
                has_weights: false,
                is_active: false,
                license_ok: false,
                detected_keywords: [],
                flags: []
            }
        }

        // --- GITHUB HANDLING ---
        if (repoId.includes('github.com')) {
            const match = repoId.match(/github\.com\/([^\/]+)\/([^\/\.]+)/)
            if (!match) return NextResponse.json({ error: 'Invalid GitHub URL format' }, { status: 400 })

            const fullName = `${match[1]}/${match[2]}`

            // 1. Fetch Repo Metadata
            const metaRes = await fetch(`https://api.github.com/repos/${fullName}`)
            if (!metaRes.ok) return NextResponse.json({ error: 'GitHub repository not found' }, { status: 404 })
            const meta = await metaRes.json()

            // 2. Commits (Activity Check) - Check if active in last 6 months
            const commitsRes = await fetch(`https://api.github.com/repos/${fullName}/commits?per_page=1`)
            if (commitsRes.ok) {
                const commits = await commitsRes.json()
                if (commits.length > 0) {
                    const lastDate = new Date(commits[0].commit.author.date)
                    const sixMonthsAgo = new Date()
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
                    result.analysis.is_active = lastDate > sixMonthsAgo
                }
            }

            // 3. License Check
            if (meta.license && meta.license.key) {
                result.analysis.license_ok = OPEN_LICENSES.some(l => meta.license.key.toLowerCase().includes(l)) || meta.license.key === 'other'
            }

            // 4. README
            const readmeRes = await fetch(`https://raw.githubusercontent.com/${fullName}/HEAD/README.md`)
            const readme = readmeRes.ok ? await readmeRes.text() : ''
            const cleanReadme = readme.replace(/^---\n[\s\S]*?\n---\n/, '')

            result.name = meta.name
            result.tagline = meta.description || `Open source project by ${match[1]}`
            result.description = cleanReadme
            result.url = meta.html_url
            result.analysis.has_weights = true // Assume code repos have "content"

            // Keyword Analysis
            const content = (result.tagline + ' ' + result.description).toLowerCase()
            result.analysis.detected_keywords = EFFICIENCY_KEYWORDS.filter(k => content.includes(k))

        }
        // --- HUGGING FACE HANDLING ---
        else {
            const cleanId = repoId.replace('https://huggingface.co/', '').split('/tree/')[0]

            // 1. Fetch Model Metadata (with siblings for file check)
            const metaRes = await fetch(`https://huggingface.co/api/models/${cleanId}`)
            if (!metaRes.ok) return NextResponse.json({ error: 'Repository not found on Hugging Face' }, { status: 404 })
            const meta = await metaRes.json()

            // 2. Weights Check (Look for actual model files)
            if (meta.siblings) {
                const hasModelFile = meta.siblings.some((f: any) =>
                    f.rfilename.endsWith('.safetensors') ||
                    f.rfilename.endsWith('.bin') ||
                    f.rfilename.endsWith('.gguf') ||
                    f.rfilename.endsWith('.onnx') ||
                    f.rfilename.endsWith('.tflite')
                )
                result.analysis.has_weights = hasModelFile
                if (!hasModelFile) result.analysis.flags.push('No model weights found')
            }

            // 3. License Check
            const license = meta.cardData?.license || meta.tags?.find((t: string) => t.startsWith('license:'))?.split(':')[1]
            if (license) {
                result.analysis.license_ok = OPEN_LICENSES.some(l => license.toLowerCase().includes(l))
            }

            // 4. Activity (based on lastModified)
            if (meta.lastModified) {
                const lastDate = new Date(meta.lastModified)
                const sixMonthsAgo = new Date()
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
                result.analysis.is_active = lastDate > sixMonthsAgo
            }

            // 5. README
            let readmeRes = await fetch(`https://huggingface.co/${cleanId}/resolve/main/README.md`)
            let readme = readmeRes.ok ? await readmeRes.text() : ''
            const cleanReadme = readme.replace(/^---\n[\s\S]*?\n---\n/, '')

            result.name = meta.id.split('/').pop()
            result.tagline = `Hugging Face model: ${meta.pipeline_tag || 'AI Model'} by ${meta.author || meta.id.split('/')[0]}`
            result.description = cleanReadme
            result.url = `https://huggingface.co/${cleanId}`

            // Keyword Analysis
            const content = (result.tagline + ' ' + result.description).toLowerCase()
            result.analysis.detected_keywords = EFFICIENCY_KEYWORDS.filter(k => content.includes(k))
        }

        return NextResponse.json(result)

    } catch (error) {
        console.error('Ingest Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
