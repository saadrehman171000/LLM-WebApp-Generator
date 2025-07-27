"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Loader2, Code, Zap, Eye, FileText } from "lucide-react"
import { CodePreview } from "@/components/code-preview"
import { downloadProject } from "@/lib/download-utils"

interface GeneratedCode {
  files: Array<{ path: string; content: string }>
}

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("frontend")

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate code")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedCode(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate code")
      }

      const data = await response.json()
      setGeneratedCode(data)
      setActiveTab("frontend")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedCode) return

    try {
      await downloadProject(generatedCode, prompt)
    } catch {
      setError("Failed to download project")
    }
  }

  // Separate frontend and API files for display
  const frontendFiles =
    generatedCode?.files.filter(
      (file) =>
        !file.path.startsWith("app/api/") &&
        (file.path.startsWith("app/") ||
          file.path.startsWith("components/") ||
          file.path.startsWith("lib/") ||
          file.path.includes(".css") ||
          file.path.includes("package.json") ||
          file.path.includes("tailwind")),
    ) || []

  const apiFiles = generatedCode?.files.filter((file) => file.path.startsWith("app/api/")) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Web App Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate complete full-stack Next.js applications with AI. Frontend pages, components, and API routes in a
            single project.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Describe Your Web Application
            </CardTitle>
            <CardDescription>
              Enter a detailed description of the web application you want to generate. Be specific about features,
              design, and functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: Create a modern task management app with user authentication, drag-and-drop functionality, real-time updates, and a clean dashboard interface..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1 sm:flex-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Full-Stack App
                  </>
                )}
              </Button>
              {generatedCode && (
                <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Generated Code Display */}
        {generatedCode && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Generated Full-Stack App
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Total: {generatedCode.files.length} files
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Frontend: {frontendFiles.length} files
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    API: {apiFiles.length} routes
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Your generated full-stack Next.js application is ready. Frontend and API routes in a single project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="frontend" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Frontend
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    API Routes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="frontend" className="mt-4">
                  <CodePreview files={frontendFiles} type="frontend" />
                </TabsContent>

                <TabsContent value="api" className="mt-4">
                  <CodePreview files={apiFiles} type="backend" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
