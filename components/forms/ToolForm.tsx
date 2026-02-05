'use client'

import { logEvent } from '@/actions/analytics'
import { publishTool } from '@/actions/publish-tool'
import { useState, useEffect } from 'react'
import { Loader2, Cpu, HardDrive, Wifi, WifiOff, Zap, Server, Smartphone, CheckCircle2, Link2, FileText, AlertCircle } from 'lucide-react'

export interface ToolFormProps {
    categories: any[]
    toolId?: string
    defaultValues?: {
        name?: string
        tagline?: string
        description?: string
        url?: string
        category_id?: string
        license_url?: string
        min_ram?: string
        storage_footprint?: string
        is_offline_capable?: boolean
        gpu_vram?: string
        supported_hardware?: string[]
        deployment_context?: string[]
        efficiency_justification?: string
        efficiency_evidence_links?: string[]
    }
    analysis?: {
        has_weights: boolean
        is_active: boolean
        license_ok: boolean
        detected_keywords: string[]
        flags: string[]
    }
}

export function ToolForm({ categories, toolId, defaultValues, analysis }: ToolFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isGpuSelected, setIsGpuSelected] = useState(defaultValues?.supported_hardware?.includes('GPU') || false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const result = await publishTool(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Reusable input styles
    const inputStyles = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-200"
    const labelStyles = "block text-sm font-medium text-neutral-300 mb-2"
    const selectStyles = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-200 appearance-none cursor-pointer"
    const sectionTitleStyles = "text-lg font-semibold text-white flex items-center gap-3 mb-6"
    const checkboxCardStyles = "flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 group"

    useEffect(() => {
        // Track Form Start (once per session/mount)
        logEvent('form_start', undefined, { step: 'initial_load' })
    }, [])

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {toolId && <input type="hidden" name="tool_id" value={toolId} />}
            {analysis && <input type="hidden" name="vetting_results" value={JSON.stringify(analysis)} />}

            {/* Analysis Summary Card */}
            {analysis && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        Automated Vetting Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-xl border ${analysis.has_weights ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <HardDrive className={`w-4 h-4 ${analysis.has_weights ? 'text-emerald-400' : 'text-red-400'}`} />
                                <span className={`text-sm font-bold ${analysis.has_weights ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {analysis.has_weights ? 'Weights Found' : 'No Weights'}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400">Model files detected.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${analysis.is_active ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Cpu className={`w-4 h-4 ${analysis.is_active ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <span className={`text-sm font-bold ${analysis.is_active ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {analysis.is_active ? 'Active Project' : 'Low Activity'}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400">Commits in last 6mo.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${analysis.license_ok ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className={`w-4 h-4 ${analysis.license_ok ? 'text-emerald-400' : 'text-red-400'}`} />
                                <span className={`text-sm font-bold ${analysis.license_ok ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {analysis.license_ok ? 'Open License' : 'Restricted License'}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400">Permissive usage.</p>
                        </div>
                    </div>
                    {analysis.detected_keywords.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-xs text-neutral-500 mb-2">Detected Efficiency Features:</p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.detected_keywords.map(k => (
                                    <span key={k} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-neutral-300 capitalize">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Section 1: Basic Information */}
            <section className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className={sectionTitleStyles}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold">1</span>
                    Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelStyles}>Tool Name *</label>
                        <input
                            name="name"
                            placeholder="e.g. TinyLlama Edge"
                            required
                            defaultValue={defaultValues?.name}
                            className={inputStyles}
                        />
                    </div>
                    <div>
                        <label className={labelStyles}>Tagline *</label>
                        <input
                            name="tagline"
                            placeholder="Short, catchy description"
                            required
                            defaultValue={defaultValues?.tagline}
                            className={inputStyles}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <label className={labelStyles}>Destination URL *</label>
                    <input
                        name="url"
                        type="url"
                        placeholder="https://github.com/..."
                        required
                        defaultValue={defaultValues?.url}
                        className={inputStyles}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-5">
                    <div>
                        <label className={labelStyles}>Category *</label>
                        <div className="relative">
                            <select
                                name="category_id"
                                required
                                defaultValue={defaultValues?.category_id || ""}
                                className={selectStyles}
                            >
                                <option value="" disabled>Select a Category</option>
                                {categories?.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▾</div>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>License URL</label>
                        <input
                            name="license_url"
                            type="url"
                            placeholder="https://github.com/.../LICENSE"
                            defaultValue={defaultValues?.license_url}
                            className={inputStyles}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Hardware Constraints */}
            <section className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className={sectionTitleStyles}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold">2</span>
                    Hardware Constraints
                </h3>
                <div className="grid md:grid-cols-3 gap-5">
                    <div>
                        <label className={labelStyles}>Minimum RAM *</label>
                        <div className="relative">
                            <select name="min_ram" required defaultValue={defaultValues?.min_ram || ""} className={selectStyles}>
                                <option value="" disabled>Select RAM</option>
                                <option value="< 1GB">&lt; 1GB</option>
                                <option value="4GB">4GB</option>
                                <option value="8GB">8GB</option>
                                <option value="16GB">16GB</option>
                                <option value="32GB+">32GB+</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▾</div>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>Storage Footprint *</label>
                        <input
                            name="storage_footprint"
                            placeholder="e.g. 2.5GB"
                            required
                            defaultValue={defaultValues?.storage_footprint}
                            className={inputStyles}
                        />
                    </div>
                    <div>
                        <label className={labelStyles}>Offline Capable?</label>
                        <label className={checkboxCardStyles + " mt-0"}>
                            <input
                                type="checkbox"
                                name="is_offline_capable"
                                defaultChecked={defaultValues?.is_offline_capable}
                                className="sr-only peer"
                            />
                            <div className="w-5 h-5 rounded-md border-2 border-white/20 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all">
                                <CheckCircle2 className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                            </div>
                            <WifiOff className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm text-neutral-300">Works offline</span>
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <label className={labelStyles}>Supported Hardware</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: 'hardware_cpu', value: 'CPU', icon: Cpu, label: 'CPU' },
                            { name: 'hardware_gpu', value: 'GPU', icon: Zap, label: 'GPU', onChange: (e: any) => setIsGpuSelected(e.target.checked) },
                            { name: 'hardware_edge', value: 'Edge/NPU', icon: Smartphone, label: 'Edge / RPi' },
                            { name: 'hardware_apple', value: 'Apple Silicon', icon: Server, label: 'Apple Silicon' },
                        ].map(hw => (
                            <label key={hw.name} className={checkboxCardStyles}>
                                <input
                                    type="checkbox"
                                    name={hw.name}
                                    value={hw.value}
                                    defaultChecked={defaultValues?.supported_hardware?.includes(hw.value)}
                                    className="sr-only peer"
                                    onChange={hw.onChange}
                                />
                                <div className="w-5 h-5 rounded-md border-2 border-white/20 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all">
                                    <CheckCircle2 className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                                <hw.icon className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                                <span className="text-sm text-neutral-300">{hw.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {isGpuSelected && (
                    <div className="mt-5 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelStyles}>Minimum GPU VRAM</label>
                        <input
                            name="gpu_vram"
                            placeholder="e.g. 6GB, 24GB"
                            defaultValue={defaultValues?.gpu_vram}
                            className={inputStyles}
                        />
                    </div>
                )}
            </section>

            {/* Section 3: Efficiency Evidence - CRITICAL */}
            <section className="bg-[#111] border border-emerald-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                <h3 className={sectionTitleStyles}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">3</span>
                    Efficiency Evidence
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Required</span>
                </h3>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-400">
                        Frugal AI Hub is a vetted marketplace. You <strong className="text-white">must</strong> provide evidence that your tool is efficient (quantization, distillation, benchmarks, etc.).
                    </p>
                </div>

                <div>
                    <label className={labelStyles}>Efficiency Justification *</label>
                    <textarea
                        name="efficiency_justification"
                        className={inputStyles + " min-h-[120px] resize-none"}
                        placeholder="Explain why this tool is frugal. Does it use quantization? Distillation? Efficient kernels? Low memory footprint?"
                        required
                        defaultValue={defaultValues?.efficiency_justification}
                    ></textarea>
                </div>

                <div className="mt-5">
                    <label className={labelStyles}>
                        <Link2 className="w-4 h-4 inline mr-2 text-emerald-400" />
                        Evidence Links (Benchmarks, Papers, Blogs)
                    </label>
                    <div className="space-y-3">
                        <input
                            name="evidence_link_1"
                            placeholder="https://..."
                            defaultValue={defaultValues?.efficiency_evidence_links?.[0]}
                            className={inputStyles}
                        />
                        <input
                            name="evidence_link_2"
                            placeholder="https://..."
                            defaultValue={defaultValues?.efficiency_evidence_links?.[1]}
                            className={inputStyles}
                        />
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">GitHub READMEs with benchmarks are accepted.</p>
                </div>
            </section>

            {/* Section 4: Deployment Context */}
            <section className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className={sectionTitleStyles}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold">4</span>
                    Deployment Context
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { name: 'deploy_edge', value: 'Edge / On-device', icon: Smartphone, label: 'Edge / On-device', desc: 'Phones, IoT, laptops' },
                        { name: 'deploy_prem', value: 'On-prem / Sovereign', icon: Server, label: 'On-prem', desc: 'Private data centers' },
                        { name: 'deploy_enterprise', value: 'Enterprise Backend', icon: HardDrive, label: 'Enterprise', desc: 'K8s, Docker, scalable' },
                    ].map(dep => (
                        <label key={dep.name} className="p-5 bg-[#0a0a0a] border border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 group block">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name={dep.name}
                                    value={dep.value}
                                    defaultChecked={defaultValues?.deployment_context?.includes(dep.value)}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 mt-0.5 rounded-md border-2 border-white/20 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex-shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <dep.icon className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                                        <span className="font-medium text-white">{dep.label}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500">{dep.desc}</p>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* Section 5: Description */}
            <section className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className={sectionTitleStyles}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold">5</span>
                    <FileText className="w-5 h-5 text-neutral-400" />
                    Full Description
                </h3>
                <textarea
                    name="description_md"
                    className={inputStyles + " min-h-[180px] font-mono text-sm resize-none"}
                    placeholder="# Features&#10;&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Usage&#10;..."
                    defaultValue={defaultValues?.description}
                ></textarea>
                <p className="text-xs text-neutral-500 mt-2">Supports Markdown formatting.</p>
            </section>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {toolId ? 'Updating Tool...' : 'Submitting for Review...'}
                        </>
                    ) : (
                        toolId ? 'Update Tool' : 'Submit for Review'
                    )}
                </button>
                <p className="text-xs text-neutral-500 text-center max-w-md">
                    {toolId
                        ? <>Updates may require <strong>re-approval</strong> if significant changes are detected.</>
                        : <>Your tool will be set to <strong className="text-neutral-300">Pending Review</strong>. Our automated system will perform initial checks before it goes live.</>
                    }
                </p>
            </div>
        </form>
    )
}
