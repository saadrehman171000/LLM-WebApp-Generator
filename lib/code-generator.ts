interface CodeFile {
  path: string
  content: string
}

interface GenerationResult {
  files: CodeFile[]
  preview?: string
}

const V0_API_KEY = process.env.V0_API_KEY
const V0_API_URL = "https://api.v0.dev/v1/chat/completions"

export async function generateFullStackCode(prompt: string): Promise<GenerationResult> {
  if (!V0_API_KEY) {
    throw new Error("V0_API_KEY environment variable is not set. Please add it to your .env file.")
  }

  try {
    // Step 1: Generate core configuration and setup files
    const setupPrompt = `
Generate the core configuration and setup files for a complete Next.js 14 application based on this request: "${prompt}"

IMPORTANT: Use SQLite3 as the database (not PostgreSQL) for easy setup. The database file should be created automatically.

CRITICAL: For package.json, use ONLY these reliable dependencies:
- next: "14.0.4"
- react: "18.2.0"
- react-dom: "18.2.0"
- @prisma/client: "^5.7.1"
- clsx: "^2.0.0"
- tailwind-merge: "^2.0.0"
- lucide-react: "^0.294.0"
- date-fns: "^3.0.6"
- zod: "^3.22.4"

Dev dependencies:
- typescript: "^5"
- @types/node: "^20"
- @types/react: "^18"
- @types/react-dom: "^18"
- tailwindcss: "^3.3.0"
- autoprefixer: "^10.4.16"
- postcss: "^8.4.31"
- prisma: "^5.7.1"
- eslint: "^8"
- eslint-config-next: "14.0.4"

DO NOT use any @radix-ui packages or other experimental packages.

Generate ONLY these files:
1. package.json - with the exact dependencies listed above
2. next.config.js - Next.js configuration
3. tsconfig.json - TypeScript configuration
4. tailwind.config.js - TailwindCSS configuration
5. app/globals.css - Complete CSS setup with variables
6. lib/utils.ts - Utility functions
7. lib/types.ts - TypeScript type definitions
8. prisma/schema.prisma - SQLite3 database schema with proper models
9. lib/prisma.ts - Database client setup
10. README.md - Simple setup instructions (just npm install, npm run dev)
11. .env.example - Environment variables template (DATABASE_URL="file:./dev.db")
12. scripts/setup.js - Database initialization script that runs prisma generate and prisma db push

Use file="path" syntax for each code block. Make sure all files are complete and production-ready.
    `.trim()

    console.log("Step 1: Generating setup files...")
    const setupResponse = await fetch(V0_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "v0-1.5-md",
        messages: [{ role: "user", content: setupPrompt }],
      }),
    })

    if (!setupResponse.ok) {
      const errorText = await setupResponse.text()
      throw new Error(`V0 API error: ${setupResponse.status} - ${errorText}`)
    }

    const setupData = await setupResponse.json()
    const setupFiles = parseV0Response(setupData)
    console.log("Setup files generated:", setupFiles.map(f => f.path))

    // Step 2: Generate main application pages
    const pagesPrompt = `
Based on this request: "${prompt}", generate the main application pages.

CRITICAL: Generate COMPLETE, WORKING code with no syntax errors. Each file must be a complete, valid TypeScript/React component.

Generate ONLY these files:
1. app/layout.tsx - Root layout with proper metadata and navigation
2. app/page.tsx - Main page with the core functionality
3. app/tasks/new/page.tsx - Create new task page
4. app/tasks/[id]/page.tsx - View task details page
5. app/tasks/[id]/edit/page.tsx - Edit task page

MANDATORY REQUIREMENTS:
- EVERY .tsx file MUST start with: "import React from 'react'"
- EVERY .tsx file MUST have: "export default function ComponentName() {"
- EVERY .tsx file MUST end with: "}"
- NO JSX without React import
- NO incomplete function declarations
- Use ONLY components that exist (Header, Footer, TaskCard, TaskForm, etc.)
- Include proper error handling and loading states
- Make sure all syntax is valid TypeScript/React

EXAMPLE STRUCTURE (MANDATORY):
\`\`\`tsx
import React from 'react'

export default function PageName() {
  return (
    <div>
      {/* Your JSX content */}
    </div>
  )
}
\`\`\`

CRITICAL: Follow this exact structure for every .tsx file. Do not skip the React import.

Use file="path" syntax for each code block. Make sure all files are complete and production-ready.
    `.trim()

    console.log("Step 2: Generating main pages...")
    const pagesResponse = await fetch(V0_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "v0-1.5-md",
        messages: [{ role: "user", content: pagesPrompt }],
      }),
    })

    if (!pagesResponse.ok) {
      const errorText = await pagesResponse.text()
      throw new Error(`V0 API error: ${pagesResponse.status} - ${errorText}`)
    }

    const pagesData = await pagesResponse.json()
    const pagesFiles = parseV0Response(pagesData)
    console.log("Pages generated:", pagesFiles.map(f => f.path))

    // Step 3: Generate API routes
    const apiPrompt = `
Based on this request: "${prompt}", generate the API routes needed for the application.

Generate ONLY these files:
1. app/api/route.ts - Main API endpoint (if needed)
2. Any specific API routes needed (e.g., app/api/tasks/route.ts, app/api/tasks/[id]/route.ts, etc.)

Make sure each API route is complete, handles all HTTP methods (GET, POST, PUT, DELETE), includes proper error handling, validation, and database operations if needed.

Use file="path" syntax for each code block.
    `.trim()

    console.log("Step 3: Generating API routes...")
    const apiResponse = await fetch(V0_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "v0-1.5-md",
        messages: [{ role: "user", content: apiPrompt }],
      }),
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      throw new Error(`V0 API error: ${apiResponse.status} - ${errorText}`)
    }

    const apiData = await apiResponse.json()
    const apiFiles = parseV0Response(apiData)
    console.log("API routes generated:", apiFiles.map(f => f.path))

    // Step 4: Generate components
    const componentsPrompt = `
Based on this request: "${prompt}", generate the reusable components needed for the application.

CRITICAL: Generate COMPLETE, WORKING components with no syntax errors. Each component must be a complete, valid TypeScript/React component.

Generate ONLY these files:
1. components/Header.tsx - Navigation header
2. components/Footer.tsx - Footer component
3. components/TaskCard.tsx - Display individual task
4. components/TaskForm.tsx - Form for creating/editing tasks
5. components/TaskList.tsx - List of tasks
6. components/ui/Button.tsx - Reusable button component
7. components/ui/Input.tsx - Reusable input component
8. components/ui/Select.tsx - Reusable select component
9. components/Navigation.tsx - Navigation component (if needed)
10. components/ui/Toaster.tsx - Toast notification component (if needed)

MANDATORY REQUIREMENTS:
- EVERY .tsx file MUST start with: "import React from 'react'"
- EVERY .tsx file MUST have: "export default function ComponentName() {"
- EVERY .tsx file MUST end with: "}"
- NO JSX without React import
- NO incomplete function declarations
- Use ONLY standard React hooks and patterns
- Include proper TypeScript types and error handling
- Make sure all syntax is valid TypeScript/React
- Components should be self-contained and reusable

EXAMPLE STRUCTURE (MANDATORY):
\`\`\`tsx
import React from 'react'

interface ComponentProps {
  // Your props here
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div>
      {/* Your JSX content */}
    </div>
  )
}
\`\`\`

CRITICAL: Follow this exact structure for every .tsx file. Do not skip the React import.

Use file="path" syntax for each code block. Make sure all components are complete and production-ready.
    `.trim()

    console.log("Step 4: Generating components...")
    const componentsResponse = await fetch(V0_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "v0-1.5-md",
        messages: [{ role: "user", content: componentsPrompt }],
      }),
    })

    if (!componentsResponse.ok) {
      const errorText = await componentsResponse.text()
      throw new Error(`V0 API error: ${componentsResponse.status} - ${errorText}`)
    }

    const componentsData = await componentsResponse.json()
    const componentsFiles = parseV0Response(componentsData)
    console.log("Components generated:", componentsFiles.map(f => f.path))

    // Combine all files
    const allV0Files = [...setupFiles, ...pagesFiles, ...apiFiles, ...componentsFiles]
    console.log("Total V0 files generated:", allV0Files.map(f => f.path))

    // Get fallback files to ensure complete project structure
    const fallbackResult = generateFallbackFullStack(prompt)
    const fallbackFiles = fallbackResult.files

    // Merge V0 files with fallback files, prioritizing V0 files
    const mergedFiles: CodeFile[] = []
    const processedPaths = new Set<string>()

    // Add V0 files first
    allV0Files.forEach(file => {
      // Rename generated files to proper paths
      let finalPath = file.path
      if (file.path.startsWith('src/generated-')) {
        // Check if this looks like a page component
        if (file.content.includes('export default function') && file.content.includes('return (')) {
          finalPath = 'app/page.tsx'
        } else if (file.content.includes('export default function RootLayout')) {
          finalPath = 'app/layout.tsx'
        } else if (file.content.includes('@tailwind')) {
          finalPath = 'app/globals.css'
        } else if (file.content.includes('"name":') && file.content.includes('"dependencies":')) {
          finalPath = 'package.json'
        } else if (file.content.includes('module.exports') && file.content.includes('tailwindcss')) {
          finalPath = 'tailwind.config.js'
        } else if (file.content.includes('"compilerOptions"')) {
          finalPath = 'tsconfig.json'
        } else if (file.content.includes('interface') || file.content.includes('export interface')) {
          finalPath = 'lib/types.ts'
        } else if (file.content.includes('export function') && file.content.includes('cn(')) {
          finalPath = 'lib/utils.ts'
        } else if (file.content.includes('model Task') || file.content.includes('generator client')) {
          finalPath = 'prisma/schema.prisma'
        } else if (file.content.includes('PrismaClient') || file.content.includes('@prisma/client')) {
          finalPath = 'lib/prisma.ts'
        }
      }
      
      mergedFiles.push({ ...file, path: finalPath })
      processedPaths.add(finalPath)
    })

    // Check for missing imports and create placeholder files
    const missingFiles = findMissingImports(allV0Files, processedPaths)
    missingFiles.forEach(file => {
      mergedFiles.push(file)
      processedPaths.add(file.path)
    })

    // Fix CSS variables in globals.css
    const globalsCssFile = mergedFiles.find(f => f.path === 'app/globals.css')
    if (globalsCssFile) {
      globalsCssFile.content = fixCSSVariables(globalsCssFile.content)
    }

    // Fix package.json to ensure reliable dependencies
    const packageJsonFile = mergedFiles.find(f => f.path === 'package.json')
    if (packageJsonFile) {
      packageJsonFile.content = fixPackageJson(packageJsonFile.content)
      
      // Double-check that turbopack flag is removed
      if (packageJsonFile.content.includes('--turbopack')) {
        console.log('🚨 TURBOPACK FLAG STILL PRESENT - forcing removal')
        packageJsonFile.content = packageJsonFile.content.replace('--turbopack', '').replace('  --turbopack', '').replace('--turbopack  ', '')
      }
    }

    // Fix incomplete code files
    mergedFiles.forEach(file => {
      if (file.path.endsWith('.tsx') || file.path.endsWith('.ts')) {
        file.content = fixIncompleteCode(file.content, file.path)
      }
    })

    // Final safety check: Replace any .tsx file that still has JSX without proper React setup
    mergedFiles.forEach(file => {
      if (file.path.endsWith('.tsx')) {
        const hasReactImport = file.content.includes('import React') || 
                              file.content.includes('import { React }') || 
                              file.content.includes('import * as React')
        const hasJSX = file.content.includes('<')
        const hasExportFunction = file.content.includes('export default function')
        
        console.log(`🔍 Checking ${file.path}:`, {
          hasReactImport,
          hasJSX,
          hasExportFunction,
          contentPreview: file.content.substring(0, 100) + '...'
        })
        
        if (hasJSX && (!hasReactImport || !hasExportFunction)) {
          console.log(`🚨 CRITICAL: Replacing ${file.path} - has JSX but no proper React setup`)
          file.content = generateSafeFallback(file.path, prompt)
        }
      }
    })

    // Ensure critical files are completely valid
    const criticalFiles = ['app/page.tsx', 'app/layout.tsx']
    criticalFiles.forEach(criticalPath => {
      const file = mergedFiles.find(f => f.path === criticalPath)
      if (file) {
        const hasReactImport = file.content.includes('import React') || 
                              file.content.includes('import { React }') || 
                              file.content.includes('import * as React')
        const hasExportFunction = file.content.includes('export default function')
        const hasJSX = file.content.includes('<')
        
        // Check for prompt content that leaked into the code
        const hasPromptContent = file.content.includes('Every .tsx file MUST') ||
                                file.content.includes('EVERY .tsx file MUST') ||
                                file.content.includes('CRITICAL: Follow') ||
                                file.content.includes('MANDATORY REQUIREMENTS') ||
                                file.content.includes('EXAMPLE STRUCTURE') ||
                                file.content.includes('Use file="path" syntax')
        
        console.log(`Checking ${criticalPath}:`, {
          hasReactImport,
          hasExportFunction,
          hasJSX,
          hasPromptContent,
          contentPreview: file.content.substring(0, 200) + '...'
        })
        
        if (hasPromptContent) {
          console.log(`🚨 PROMPT CONTENT DETECTED: ${criticalPath} - replacing with safe fallback`)
          file.content = generateSafeFallback(criticalPath, prompt)
        } else if (hasJSX && (!hasReactImport || !hasExportFunction)) {
          console.log(`❌ Replacing problematic ${criticalPath} with safe fallback`)
          
          // Use enhanced UI fallback for UI components
          if (criticalPath.includes('ui/')) {
            file.content = generateUISafeFallback(criticalPath)
          } else {
            file.content = generateSafeFallback(criticalPath, prompt)
          }
        }
      }
    })

    // Add fallback files for missing essential files
    fallbackFiles.forEach(file => {
      if (!processedPaths.has(file.path)) {
        mergedFiles.push(file)
        processedPaths.add(file.path)
      }
    })

    // Ensure we have all essential files
    const essentialFiles = [
      'app/page.tsx',
      'app/layout.tsx', 
      'app/globals.css',
      'package.json',
      'tailwind.config.js',
      'tsconfig.json',
      'next.config.js'
    ]

    essentialFiles.forEach(essentialPath => {
      if (!processedPaths.has(essentialPath)) {
        const fallbackFile = fallbackFiles.find(f => f.path === essentialPath)
        if (fallbackFile) {
          mergedFiles.push(fallbackFile)
          processedPaths.add(essentialPath)
        }
      }
    })

    console.log("Final merged files:", mergedFiles.map(f => f.path))

    // Final validation: Ensure no problematic files exist
    const validatedFiles = mergedFiles.map(file => validateAndFixFile(file, prompt))
    
    console.log("✅ Generation complete with validation")

    return {
      files: validatedFiles,
      preview: "Complete application generated successfully!",
    }
  } catch (error) {
    console.error("Full-stack generation error:", error)

    // Fallback: Generate basic Next.js full-stack structure
    return generateFallbackFullStack(prompt)
  }
}

function parseV0Response(data: unknown): CodeFile[] {
  const files: CodeFile[] = []

  try {
    // Handle OpenAI Chat Completions format
    const dataObj = data as { choices?: Array<{ message?: { content?: string } }> }
    const content = dataObj.choices?.[0]?.message?.content || ""

    if (!content) {
      return []
    }

    // Try multiple parsing strategies
    
    // Strategy 1: Look for code blocks with file paths
    const codeBlockRegex = /```(\w+)?\s*(?:file="([^"]+)")?\s*\n([\s\S]*?)\n```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [, language, filePath, code] = match

      if (code && code.trim()) {
        const path = filePath || `src/generated-${files.length + 1}.${getExtensionFromLanguage(language || "tsx")}`
        files.push({
          path,
          content: code.trim(),
        })
      }
    }

    // Strategy 2: Look for file paths in the content (without code blocks)
    if (files.length === 0) {
      const filePathRegex = /(?:file|path):\s*([^\n]+\.(?:tsx?|jsx?|json|css|md|yml|yaml|env|gitignore))/gi
      const fileMatches = content.match(filePathRegex)
      
      if (fileMatches) {
        // Extract file paths and try to find corresponding content
        for (const fileMatch of fileMatches) {
          const filePath = fileMatch.replace(/(?:file|path):\s*/i, '').trim()
          // Look for content after the file path
          const contentAfterPath = content.substring(content.indexOf(fileMatch) + fileMatch.length)
          const nextFileMatch = contentAfterPath.match(/(?:file|path):\s*[^\n]+\.(?:tsx?|jsx?|json|css|md|yml|yaml|env|gitignore)/i)
          
          let fileContent = contentAfterPath
          if (nextFileMatch) {
            fileContent = contentAfterPath.substring(0, contentAfterPath.indexOf(nextFileMatch[0]))
          }
          
          // Clean up the content
          fileContent = fileContent.trim()
          if (fileContent && !fileContent.startsWith('```')) {
            files.push({
              path: filePath,
              content: fileContent,
            })
          }
        }
      }
    }

    // Strategy 3: Look for common file patterns in the content
    if (files.length === 0) {
      const commonFiles = [
        { path: 'app/page.tsx', patterns: ['export default function', 'function Home', 'return (', 'export default function Home'] },
        { path: 'app/layout.tsx', patterns: ['export default function RootLayout', 'export const metadata'] },
        { path: 'app/globals.css', patterns: ['@tailwind', '@layer'] },
        { path: 'package.json', patterns: ['"name":', '"dependencies":', '"scripts":'] },
        { path: 'tailwind.config.js', patterns: ['module.exports', 'tailwindcss', 'content:'] },
        { path: 'tsconfig.json', patterns: ['"compilerOptions"', '"include"', '"exclude"'] },
      ]

      for (const file of commonFiles) {
        const hasPatterns = file.patterns.some(pattern => content.includes(pattern))
        if (hasPatterns) {
          // Extract content around these patterns
          const patternIndex = file.patterns.findIndex(pattern => content.includes(pattern))
          if (patternIndex !== -1) {
            const startIndex = content.indexOf(file.patterns[patternIndex])
            const endIndex = content.indexOf('\n\n', startIndex)
            const fileContent = endIndex !== -1 ? content.substring(startIndex, endIndex) : content.substring(startIndex)
            
            files.push({
              path: file.path,
              content: fileContent.trim(),
            })
          }
        }
      }
    }

    // Strategy 4: Look for the main page component specifically
    if (!files.find(f => f.path === 'app/page.tsx')) {
      // Try to find the main page component in the content
      const pagePatterns = [
        /export default function \w+\([^)]*\)\s*{[\s\S]*?}/,
        /function \w+\([^)]*\)\s*{[\s\S]*?return \([\s\S]*?\)[\s\S]*?}/,
        /export default function[\s\S]*?return \([\s\S]*?\)[\s\S]*?}/
      ]
      
      for (const pattern of pagePatterns) {
        const match = content.match(pattern)
        if (match) {
          files.push({
            path: 'app/page.tsx',
            content: match[0].trim(),
          })
          break
        }
      }
    }

    // If still no files found, try to parse as single file
    if (files.length === 0 && content.trim()) {
      files.push({
        path: "app/page.tsx",
        content: content.trim(),
      })
    }
  } catch (error) {
    console.error("Error parsing v0 response:", error)
  }

  return files.length > 0 ? files : []
}

function getExtensionFromLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    typescript: "ts",
    tsx: "tsx",
    javascript: "js",
    jsx: "jsx",
    json: "json",
    css: "css",
    html: "html",
    markdown: "md",
    yaml: "yml",
    bash: "sh",
  }
  return extensionMap[language.toLowerCase()] || "txt"
}

function generateFallbackFullStack(prompt: string): GenerationResult {
  // Create a more generic fallback that adapts to the user's request
  const files: CodeFile[] = [
    {
      path: "app/page.tsx",
      content: `'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Generated Application
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Based on your request: "${prompt}"
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Application Ready</h2>
          <p className="text-gray-600 mb-6">
            This is a generated full-stack Next.js application based on your prompt: "${prompt}".
            The V0 API should have generated specific functionality for your request.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Test API Connection'}
            </button>
            
            {data && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">API Response:</h3>
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Frontend Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• React components with hooks</li>
              <li>• TailwindCSS styling</li>
              <li>• Responsive design</li>
              <li>• Loading states</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Backend Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Next.js API routes</li>
              <li>• RESTful endpoints</li>
              <li>• Error handling</li>
              <li>• TypeScript support</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Next Steps</h3>
          <p className="text-yellow-700 mb-4">
            To get the best results, try being more specific in your prompt. For example:
          </p>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• "Create a todo app with add, delete, and mark as complete functionality"</li>
            <li>• "Build a blog with posts, comments, and user authentication"</li>
            <li>• "Make an e-commerce site with product catalog, shopping cart, and checkout"</li>
            <li>• "Design a dashboard with charts, user management, and real-time updates"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}`,
    },
    {
      path: "app/layout.tsx",
      content: `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generated Full-Stack App',
  description: 'AI Generated Next.js Full-Stack Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}`,
    },
    {
      path: "app/globals.css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
    },
    {
      path: "app/api/data/route.ts",
      content: `import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate some data processing
    const data = {
      message: 'Hello from the API!',
      timestamp: new Date().toISOString(),
      prompt: '${prompt}',
      features: [
        'Next.js API Routes',
        'TypeScript Support',
        'Error Handling',
        'JSON Responses'
      ]
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Process the data
    const response = {
      message: 'Data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    )
  }
}`,
    },
    {
      path: "app/api/health/route.ts",
      content: `import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
}`,
    },
    {
      path: "components/ui/button.tsx",
      content: `import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg'
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }`,
    },
    {
      path: "components/Header.tsx",
      content: `import React from 'react'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={\`bg-white shadow-sm border-b \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Generated App
            </h1>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}`,
    },
    {
      path: "components/Footer.tsx",
      content: `import React from 'react'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={\`bg-gray-50 border-t \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generated App
            </h3>
            <p className="text-gray-600">
              A Next.js application generated with AI assistance.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Contact
            </h4>
            <p className="text-gray-600">
              Email: info@example.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © 2024 Generated App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}`,
    },
    {
      path: "lib/utils.ts",
      content: `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
    },
    {
      path: "package.json",
      content: `{
  "name": "generated-fullstack-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "setup": "node scripts/setup.js"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@prisma/client": "^5.7.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^3.0.6",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "prisma": "^5.7.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}`,
    },
    {
      path: "tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}`,
    },
    {
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
    },
    {
      path: "next.config.js",
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
          as: '*.css',
        },
      },
    },
  },
}

module.exports = nextConfig`,
    },
    {
      path: "postcss.config.js",
      content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
    },
    {
      path: "prisma/schema.prisma",
      content: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime?
  priority    Priority @default(MEDIUM)
  status      Status   @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tasks")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
}`,
    },
    {
      path: "lib/prisma.ts",
      content: `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`,
    },
    {
      path: "scripts/setup.js",
      content: `const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up the database...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push the schema to the database
  console.log('🗄️  Creating database tables...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Database setup completed successfully!');
  console.log('🎉 You can now run: npm run dev');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}`,
    },
    {
      path: ".env.example",
      content: `# Database
DATABASE_URL="file:./dev.db"

# Add your other environment variables here
# API_KEYS, etc.
`,
    },
    {
      path: "README.md",
      content: `# Generated Full-Stack Application

This is a complete Next.js 14 application generated with AI assistance.

## 🚀 Quick Start

### Option 1: Using npm
\`\`\`bash
# Install dependencies
npm install

# If you get network errors, try:
npm install --legacy-peer-deps
# or
npm install --registry https://registry.npmjs.org/
\`\`\`

### Option 2: Using Yarn (if npm fails)
\`\`\`bash
# Install Yarn globally (if not installed)
npm install -g yarn

# Install dependencies
yarn install
\`\`\`

### Option 3: Network Troubleshooting
If you get network errors (ECONNRESET), try:
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Set registry explicitly
npm config set registry https://registry.npmjs.org/

# Try installation again
npm install
\`\`\`

## 🗄️ Database Setup

After installing dependencies:

\`\`\`bash
# Set up the database
npm run setup
\`\`\`

## 🚀 Start Development

\`\`\`bash
# Start the development server
npm run dev
\`\`\`

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

- \`app/\` - Next.js App Router pages and API routes
- \`components/\` - Reusable React components
- \`lib/\` - Utility functions and database client
- \`prisma/\` - Database schema and migrations

## 🛠️ Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run setup\` - Set up database
- \`npm run db:studio\` - Open Prisma Studio

## 🗄️ Database

This application uses SQLite3 with Prisma ORM. The database file (\`dev.db\`) is created automatically when you run \`npm run setup\`.

## 🚀 Deployment

This application is ready to deploy on Vercel or any other platform that supports Next.js.

## 🔧 Troubleshooting

### Network Issues
If you encounter network errors during installation:
1. Check your internet connection
2. Disable VPN if using one
3. Try using Yarn instead of npm
4. Clear npm cache: \`npm cache clean --force\`

### Database Issues
If database setup fails:
1. Make sure you have Node.js 18+ installed
2. Run \`npm run db:generate\` first
3. Then run \`npm run db:push\`

## 📝 Generated Based On

This application was generated based on the following request:
"${prompt}"
`,
    },
  ]

  return { files }
}

function findMissingImports(v0Files: CodeFile[], processedPaths: Set<string>): CodeFile[] {
  const missingFiles: CodeFile[] = []
  const seenImports = new Set<string>()

  v0Files.forEach(file => {
    const content = file.content
    const importRegex = /import\s+['"]([^'"]+)['"]/g
    let match

    while ((match = importRegex.exec(content)) !== null) {
      const [, importPath] = match
      
      // Skip external packages and Next.js imports
      if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
        let normalizedPath = importPath.replace('@/', '')
        
        // Add file extension if missing
        if (normalizedPath.includes('components/') && !normalizedPath.includes('.')) {
          normalizedPath += '.tsx'
        } else if (normalizedPath.includes('lib/') && !normalizedPath.includes('.')) {
          normalizedPath += '.ts'
        }
        
        if (!processedPaths.has(normalizedPath) && !seenImports.has(normalizedPath)) {
          const placeholderFile = createPlaceholderFile(normalizedPath)
          if (placeholderFile) {
            missingFiles.push(placeholderFile)
            seenImports.add(normalizedPath)
            console.log(`Created placeholder for missing import: ${normalizedPath}`)
          }
        }
      }
    }
  })

  // Also check for common component patterns that might be missing
  const commonComponents = ['Hero', 'FeaturedGigs', 'Categories', 'HowItWorks', 'Stats', 'Header', 'Footer', 'Navbar', 'Sidebar', 'Navigation', 'Toaster']
  commonComponents.forEach(componentName => {
    const componentPath = `components/${componentName}.tsx`
    if (!processedPaths.has(componentPath) && !seenImports.has(componentPath)) {
      const placeholderFile = createPlaceholderFile(componentPath)
      if (placeholderFile) {
        missingFiles.push(placeholderFile)
        seenImports.add(componentPath)
        console.log(`Created placeholder for common component: ${componentPath}`)
      }
    }
  })

  // Check for UI components that might be missing
  const uiComponents = ['Button', 'Input', 'Select', 'Toaster']
  uiComponents.forEach(componentName => {
    const componentPath = `components/ui/${componentName}.tsx`
    if (!processedPaths.has(componentPath) && !seenImports.has(componentPath)) {
      const placeholderFile = createPlaceholderFile(componentPath)
      if (placeholderFile) {
        missingFiles.push(placeholderFile)
        seenImports.add(componentPath)
        console.log(`Created placeholder for UI component: ${componentPath}`)
      }
    }
  })

  return missingFiles
}

function fixCSSVariables(cssContent: string): string {
  // Ensure @tailwind directives are present
  if (!cssContent.includes('@tailwind base')) {
    cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

` + cssContent
  }

  // Ensure CSS variables are defined
  if (!cssContent.includes('--border:')) {
    const cssVariables = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`
    
    // Insert CSS variables after @tailwind directives
    const tailwindEndIndex = cssContent.indexOf('@tailwind utilities;')
    if (tailwindEndIndex !== -1) {
      const insertIndex = tailwindEndIndex + '@tailwind utilities;'.length
      cssContent = cssContent.substring(0, insertIndex) + '\n' + cssVariables + cssContent.substring(insertIndex)
    } else {
      cssContent += cssVariables
    }
  }

  return cssContent
}

function fixPackageJson(packageJsonContent: string): string {
  try {
    const packageJson = JSON.parse(packageJsonContent)
    
    // Ensure reliable dependencies
    packageJson.dependencies = {
      "next": "14.0.4",
      "react": "18.2.0",
      "react-dom": "18.2.0",
      "@prisma/client": "^5.7.1",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "lucide-react": "^0.294.0",
      "date-fns": "^3.0.6",
      "zod": "^3.22.4",
      ...packageJson.dependencies
    }
    
    // Remove problematic packages
    delete packageJson.dependencies['@radix-ui/react-badge']
    delete packageJson.dependencies['@radix-ui/react-select']
    delete packageJson.dependencies['@radix-ui/react-toast']
    delete packageJson.dependencies['class-variance-authority']
    delete packageJson.dependencies['tailwindcss-animate']
    
    // Ensure reliable dev dependencies
    packageJson.devDependencies = {
      "typescript": "^5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "tailwindcss": "^3.3.0",
      "autoprefixer": "^10.4.16",
      "postcss": "^8.4.31",
      "prisma": "^5.7.1",
      "eslint": "^8",
      "eslint-config-next": "14.0.4",
      ...packageJson.devDependencies
    }
    
    // Remove problematic dev packages
    delete packageJson.devDependencies['postcss-loader']
    
    // Ensure scripts are present and fix turbopack issue
    packageJson.scripts = {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:studio": "prisma studio",
      "setup": "node scripts/setup.js",
      ...packageJson.scripts
    }
    
    // CRITICAL: Remove --turbopack flag from dev script
    if (packageJson.scripts.dev && packageJson.scripts.dev.includes('--turbopack')) {
      packageJson.scripts.dev = packageJson.scripts.dev.replace('--turbopack', '').trim()
      console.log('🔧 Removed --turbopack flag from dev script')
    }
    
    return JSON.stringify(packageJson, null, 2)
  } catch (error) {
    console.error("Error fixing package.json:", error)
    // Return a safe fallback package.json
    return `{
  "name": "generated-fullstack-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "setup": "node scripts/setup.js"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@prisma/client": "^5.7.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^3.0.6",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "prisma": "^5.7.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}`
  }
}

function fixIncompleteCode(content: string, filePath: string): string {
  // Fix common syntax issues
  let fixedContent = content

  // Remove prompt instructions that might have leaked into the code
  const promptPatterns = [
    /- Every \.tsx file MUST end with "}/g,
    /- EVERY \.tsx file MUST start with: "import React from 'react'"/g,
    /- EVERY \.tsx file MUST have: "export default function ComponentName\(\) {"/g,
    /- NO JSX without React import/g,
    /- NO incomplete function declarations/g,
    /CRITICAL: Follow this exact structure/g,
    /MANDATORY REQUIREMENTS:/g,
    /EXAMPLE STRUCTURE \(MANDATORY\):/g,
    /Use file="path" syntax for each code block/g,
    /Make sure all files are complete and production-ready/g
  ]
  
  promptPatterns.forEach(pattern => {
    fixedContent = fixedContent.replace(pattern, '')
  })

  // Clean up any remaining prompt-like content
  fixedContent = fixedContent.replace(/^[-\s]*CRITICAL:.*$/gm, '')
  fixedContent = fixedContent.replace(/^[-\s]*MANDATORY:.*$/gm, '')
  fixedContent = fixedContent.replace(/^[-\s]*IMPORTANT:.*$/gm, '')
  fixedContent = fixedContent.replace(/^[-\s]*EXAMPLE:.*$/gm, '')

  // Fix incomplete arrays/objects
  if (fixedContent.includes('const navigationItems = [') && !fixedContent.includes(']')) {
    fixedContent = fixedContent.replace(
      /const navigationItems = \[([^\]]*)$/,
      'const navigationItems = [$1]'
    )
  }

  // Fix missing closing braces
  const openBraces = (fixedContent.match(/\{/g) || []).length
  const closeBraces = (fixedContent.match(/\}/g) || []).length
  if (openBraces > closeBraces) {
    const missingBraces = openBraces - closeBraces
    fixedContent += '\n'.repeat(missingBraces) + '}'.repeat(missingBraces)
  }

  // Fix missing closing parentheses
  const openParens = (fixedContent.match(/\(/g) || []).length
  const closeParens = (fixedContent.match(/\)/g) || []).length
  if (openParens > closeParens) {
    const missingParens = openParens - closeParens
    fixedContent += ')'.repeat(missingParens)
  }

  // Fix missing imports for common components
  if (filePath.includes('layout.tsx') || filePath.includes('page.tsx')) {
    if (fixedContent.includes('@/components/navigation') && !fixedContent.includes('import.*Navigation')) {
      fixedContent = fixedContent.replace(
        /import.*from.*['"]@\/components\/navigation['"]/,
        'import { Navigation } from \'@/components/Navigation\''
      )
    }
    
    if (fixedContent.includes('@/components/ui/toaster') && !fixedContent.includes('import.*Toaster')) {
      fixedContent = fixedContent.replace(
        /import.*from.*['"]@\/components\/ui\/toaster['"]/,
        'import { Toaster } from \'@/components/ui/Toaster\''
      )
    }
  }

  // Fix incomplete React components
  if (filePath.endsWith('.tsx')) {
    // ALWAYS ensure React import is present for any JSX content
    const hasReactImport = fixedContent.includes('import React') || 
                          fixedContent.includes('import { React }') || 
                          fixedContent.includes('import * as React')
    
    if (fixedContent.includes('<') && !hasReactImport) {
      console.log(`🔧 Adding React import to ${filePath}`)
      fixedContent = `import React from 'react'

${fixedContent}`
    }
    
    // If content starts with JSX but no React import, add it
    if (fixedContent.includes('<') && !fixedContent.includes('import React') && !fixedContent.includes('import {') && !fixedContent.includes('export default')) {
      fixedContent = `import React from 'react'

export default function ${filePath.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component'}() {
  return (
${fixedContent}
  )
}`
    }
    
    // If content has JSX but no function wrapper
    if (fixedContent.includes('<') && !fixedContent.includes('export default function') && !fixedContent.includes('function') && !fixedContent.includes('const')) {
      fixedContent = `import React from 'react'

export default function ${filePath.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component'}() {
  return (
${fixedContent}
  )
}`
    }
    
    // If content has return statement but no function
    if (fixedContent.includes('return (') && !fixedContent.includes('export default function') && !fixedContent.includes('function') && !fixedContent.includes('const')) {
      fixedContent = `import React from 'react'

export default function ${filePath.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component'}() {
${fixedContent}
}`
    }
    
    // If content has export default function but no React import
    if (fixedContent.includes('export default function') && !fixedContent.includes('import React') && !fixedContent.includes('import { React }')) {
      fixedContent = `import React from 'react'

${fixedContent}`
    }
  }

  // Ensure the file ends properly
  if (!fixedContent.trim().endsWith('}') && !fixedContent.trim().endsWith(';')) {
    if (fixedContent.includes('export default function')) {
      fixedContent += '\n}'
    }
  }

  return fixedContent
}

function generateSafeFallback(filePath: string, prompt: string): string {
  if (filePath === 'app/page.tsx') {
    return `import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
            <Link 
              href="/tasks/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create New Task
            </Link>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
              <p id="total-tasks" className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">In Progress</h3>
              <p id="in-progress-tasks" className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
              <p id="completed-tasks" className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                No tasks yet. Create your first task to get started!
              </p>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Application Generated</h3>
            <p className="text-blue-700 text-sm mb-4">
              This application was generated based on: "${prompt}"
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Frontend Features</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• React components with hooks</li>
                  <li>• TailwindCSS styling</li>
                  <li>• Responsive design</li>
                  <li>• Next.js App Router</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Backend Features</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Next.js API routes</li>
                  <li>• Prisma ORM with SQLite</li>
                  <li>• TypeScript support</li>
                  <li>• Database integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`
  }
  
  if (filePath === 'app/layout.tsx') {
    return `import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Generated Application',
  description: 'A Next.js application generated with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Generated App
              </h1>
              <nav className="flex space-x-4">
                <a href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}`
  }
  
  return `import React from 'react'

export default function Component() {
  return (
    <div>
      <p>Component placeholder</p>
    </div>
  )
}`
}

// Enhanced safe fallback for UI components
function generateUISafeFallback(filePath: string): string {
  const componentName = filePath.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component'
  
  if (filePath.includes('ui/')) {
    switch (componentName.toLowerCase()) {
      case 'button':
        return `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}

export default function Button({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'primary' 
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseClasses} \${variantClasses[variant]} \${className}\`}
    >
      {children}
    </button>
  )
}`
        
      case 'input':
        return `import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
}

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  disabled = false 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={\`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent \${className}\`}
    />
  )
}`
        
      case 'select':
        return `import React from 'react'

interface SelectProps {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
  disabled?: boolean
}

export default function Select({ 
  options, 
  value, 
  onChange, 
  className = '',
  disabled = false 
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={\`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent \${className}\`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}`
        
      case 'toaster':
        return `import React from 'react'

interface ToasterProps {
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  visible?: boolean
  onClose?: () => void
}

export default function Toaster({ 
  message = 'Notification', 
  type = 'info', 
  visible = false, 
  onClose 
}: ToasterProps) {
  if (!visible) return null
  
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  
  return (
    <div className={\`fixed top-4 right-4 p-4 rounded-md shadow-lg \${typeClasses[type]}\`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}`
        
      default:
        return `import React from 'react'

interface ${componentName}Props {
  children?: React.ReactNode
  className?: string
}

export default function ${componentName}({ children, className = '' }: ${componentName}Props) {
  return (
    <div className={\`${componentName.toLowerCase()}-component \${className}\`}>
      {children || (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">${componentName}</h3>
          <p className="text-gray-500">This is a placeholder for the ${componentName} component.</p>
        </div>
      )}
    </div>
  )
}`
    }
  }
  
  return `import React from 'react'

export default function ${componentName}() {
  return (
    <div>
      <p>${componentName} component placeholder</p>
    </div>
  )
}`
}

// Additional safety function to completely validate a file
function validateAndFixFile(file: CodeFile, prompt: string): CodeFile {
  if (file.path.endsWith('.tsx')) {
    const hasReactImport = file.content.includes('import React') || 
                          file.content.includes('import { React }') || 
                          file.content.includes('import * as React')
    const hasJSX = file.content.includes('<')
    const hasExportFunction = file.content.includes('export default function')
    
    // Check for prompt content that leaked into the code
    const hasPromptContent = file.content.includes('Every .tsx file MUST') ||
                            file.content.includes('EVERY .tsx file MUST') ||
                            file.content.includes('CRITICAL: Follow') ||
                            file.content.includes('MANDATORY REQUIREMENTS') ||
                            file.content.includes('EXAMPLE STRUCTURE') ||
                            file.content.includes('Use file="path" syntax')
    
    // CRITICAL: Check for wrong component types in specific files
    if (file.path === 'app/page.tsx') {
      const hasWrongComponent = file.content.includes('export default function Header') ||
                               file.content.includes('function Header') ||
                               file.content.includes('HeaderProps') ||
                               file.content.includes('title = "Task Manager"')
      
      if (hasWrongComponent) {
        console.log(`🚨 WRONG COMPONENT DETECTED: ${file.path} contains Header instead of HomePage - replacing with safe fallback`)
        return {
          ...file,
          content: generateSafeFallback(file.path, prompt)
        }
      }
      
      // Also check for syntax errors like incomplete JSX
      if (file.content.includes('<h1') && !file.content.includes('</h1>')) {
        console.log(`🚨 SYNTAX ERROR DETECTED: ${file.path} has incomplete JSX - replacing with safe fallback`)
        return {
          ...file,
          content: generateSafeFallback(file.path, prompt)
        }
      }
    }
    
    if (file.path === 'app/layout.tsx') {
      const hasWrongComponent = file.content.includes('export default function Header') ||
                               file.content.includes('function Header') ||
                               file.content.includes('HeaderProps')
      
      if (hasWrongComponent) {
        console.log(`🚨 WRONG COMPONENT DETECTED: ${file.path} contains Header instead of RootLayout - replacing with safe fallback`)
        return {
          ...file,
          content: generateSafeFallback(file.path, prompt)
        }
      }
    }
    
    if (hasPromptContent) {
      console.log(`🚨 PROMPT CONTENT DETECTED: ${file.path} - replacing with safe fallback`)
      
      // Use enhanced UI fallback for UI components
      if (file.path.includes('ui/')) {
        return {
          ...file,
          content: generateUISafeFallback(file.path)
        }
      }
      
      return {
        ...file,
        content: generateSafeFallback(file.path, prompt)
      }
    }
    
    if (hasJSX && (!hasReactImport || !hasExportFunction)) {
      console.log(`🛡️  VALIDATION FAILED: ${file.path} - replacing with safe fallback`)
      
      // Use enhanced UI fallback for UI components
      if (file.path.includes('ui/')) {
        return {
          ...file,
          content: generateUISafeFallback(file.path)
        }
      }
      
      return {
        ...file,
        content: generateSafeFallback(file.path, prompt)
      }
    }
  }
  return file
}

function createPlaceholderFile(path: string): CodeFile | null {
  // Handle different types of missing files
  if (path.includes('components/')) {
    const componentName = path.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component'
    
    // Create more realistic placeholder components based on common patterns
    let componentContent = ''
    
    switch (componentName) {
      case 'Hero':
        componentContent = `import React from 'react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover amazing services and connect with talented professionals
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  )
}`
        break
        
      case 'FeaturedGigs':
        componentContent = `import React from 'react'

export default function FeaturedGigs() {
  const gigs = [
    { id: 1, title: 'Web Development', price: '$500', rating: 4.8 },
    { id: 2, title: 'Logo Design', price: '$200', rating: 4.9 },
    { id: 3, title: 'Content Writing', price: '$150', rating: 4.7 },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4">Starting at {gig.price}</p>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-sm text-gray-600">{gig.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
        break
        
      case 'Categories':
        componentContent = `import React from 'react'

export default function Categories() {
  const categories = [
    'Web Development', 'Design', 'Writing', 'Marketing', 'Video', 'Music'
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div key={category} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-800">{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
        break
        
      case 'HowItWorks':
        componentContent = `import React from 'react'

export default function HowItWorks() {
  const steps = [
    { step: 1, title: 'Choose a Service', description: 'Browse our categories and find the perfect service for your needs' },
    { step: 2, title: 'Connect with Professionals', description: 'Message and collaborate with talented professionals' },
    { step: 3, title: 'Get Your Project Done', description: 'Receive high-quality work and complete your project successfully' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
        break
        
      case 'Stats':
        componentContent = `import React from 'react'

export default function Stats() {
  const stats = [
    { number: '10K+', label: 'Happy Clients' },
    { number: '50K+', label: 'Projects Completed' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
  ]

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
        break
        
      default:
        componentContent = `import React from 'react'

interface ${componentName}Props {
  children?: React.ReactNode
  className?: string
}

export default function ${componentName}({ children, className = '' }: ${componentName}Props) {
  return (
    <div className={\`${componentName.toLowerCase()}-component \${className}\`}>
      {children || (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">${componentName}</h3>
          <p className="text-gray-500">This is a placeholder for the ${componentName} component.</p>
        </div>
      )}
    </div>
  )
}`
    }
    
    return {
      path,
      content: componentContent
    }
  }
  
  if (path.includes('lib/')) {
    const libName = path.split('/').pop()?.replace('.ts', '').replace('.js', '') || 'lib'
    return {
      path,
      content: `// Placeholder for ${libName}
// This is a placeholder file for missing library functionality

export const ${libName} = {
  // Placeholder implementation
  placeholder: true,
  message: 'This is a placeholder for ${libName} functionality'
}

export default ${libName}`
    }
  }
  
  if (path.includes('context/') || path.includes('-context')) {
    const contextName = path.split('/').pop()?.replace('.ts', '').replace('.js', '') || 'Context'
    return {
      path,
      content: `import React, { createContext, useContext, ReactNode } from 'react'

interface ${contextName}ContextType {
  // Placeholder context type
  placeholder: boolean
  message: string
}

const ${contextName}Context = createContext<${contextName}ContextType | undefined>(undefined)

export function ${contextName}Provider({ children }: { children: ReactNode }) {
  const value = {
    placeholder: true,
    message: 'This is a placeholder context'
  }
  
  return (
    <${contextName}Context.Provider value={value}>
      {children}
    </${contextName}Context.Provider>
  )
}

export function use${contextName}() {
  const context = useContext(${contextName}Context)
  if (context === undefined) {
    throw new Error(\`use${contextName} must be used within a ${contextName}Provider\`)
  }
  return context
}`
    }
  }
  
  return null
}

// Legacy functions for backward compatibility
export async function generateFrontendCode(prompt: string): Promise<GenerationResult> {
  return generateFullStackCode(prompt)
}

export async function generateBackendCode(): Promise<GenerationResult> {
  // Return empty since we're now generating everything in one go
  return { files: [] }
}
