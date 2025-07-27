"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, FileText, Folder } from "lucide-react"

interface CodeFile {
  path: string
  content: string
}

interface CodePreviewProps {
  files: CodeFile[]
  type: "frontend" | "backend"
}

export function CodePreview({ files, type }: CodePreviewProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState(files[0]?.path || "")

  const copyToClipboard = async (content: string, filePath: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFile(filePath)
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }

  const getFileExtension = (path: string) => {
    return path.split(".").pop() || "txt"
  }

  const getLanguageFromExtension = (ext: string) => {
    const languageMap: Record<string, string> = {
      tsx: "typescript",
      ts: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      css: "css",
      html: "html",
      md: "markdown",
      yml: "yaml",
      yaml: "yaml",
      env: "bash",
    }
    return languageMap[ext] || "text"
  }

  if (!files || files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-500 text-center">No {type} files generated</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* File Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Folder className="h-4 w-4" />
            Project Structure ({files.length} files)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {files.map((file) => (
              <Button
                key={file.path}
                variant={activeFile === file.path ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFile(file.path)}
                className="justify-start text-left h-auto p-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate text-xs">{file.path}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Display */}
      {activeFile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {activeFile}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getFileExtension(activeFile)}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const file = files.find((f) => f.path === activeFile)
                    if (file) copyToClipboard(file.content, activeFile)
                  }}
                >
                  {copiedFile === activeFile ? (
                    <>
                      <Check className="mr-2 h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code className={`language-${getLanguageFromExtension(getFileExtension(activeFile))}`}>
                  {files.find((f) => f.path === activeFile)?.content || ""}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Files Tabs (Alternative View) */}
      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFile} onValueChange={setActiveFile}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 h-auto p-1">
              {files.slice(0, 8).map((file) => (
                <TabsTrigger key={file.path} value={file.path} className="text-xs p-2 h-auto">
                  {file.path.split("/").pop()}
                </TabsTrigger>
              ))}
            </TabsList>

            {files.map((file) => (
              <TabsContent key={file.path} value={file.path} className="mt-4">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                    <code>{file.content}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(file.content, file.path)}
                  >
                    {copiedFile === file.path ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
