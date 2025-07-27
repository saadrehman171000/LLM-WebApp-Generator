import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Code,
  Eye,
  Download,
  Zap,
  Shield,
  Users,
  Smartphone,
  Database,
  Lock,
  Palette,
  GitBranch,
  Cloud,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: Code,
    title: "Full-Stack Generation",
    description: "Generate complete Next.js applications with frontend components and API routes in a single project.",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your generated application in action with responsive preview across desktop, tablet, and mobile.",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Download complete projects with all dependencies, configuration files, and setup instructions.",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate complex applications in seconds, not hours or days. Our AI processes your requirements instantly.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description:
      "Generated code follows best practices with TypeScript, proper error handling, and security considerations.",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  {
    icon: Users,
    title: "Team Friendly",
    description: "Clean, well-documented code that any developer can understand, modify, and extend.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "All generated applications are mobile-first and responsive, working perfectly on any device.",
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900",
  },
  {
    icon: Database,
    title: "Database Integration",
    description: "Generate applications with database models, API endpoints, and proper data handling patterns.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900",
  },
  {
    icon: Lock,
    title: "Authentication Ready",
    description: "Built-in support for user authentication, protected routes, and session management.",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  {
    icon: Palette,
    title: "Modern UI/UX",
    description: "Beautiful, modern interfaces using TailwindCSS and contemporary design patterns.",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900",
  },
  {
    icon: GitBranch,
    title: "Version Control Ready",
    description: "Generated projects include proper .gitignore files and are ready for version control.",
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-900",
  },
  {
    icon: Cloud,
    title: "Deploy Anywhere",
    description: "Compatible with all major hosting platforms including Vercel, Netlify, and traditional servers.",
    color: "text-slate-600",
    bgColor: "bg-slate-100 dark:bg-slate-900",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Build Modern Apps</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform provides all the tools and features you need to generate, preview, and deploy
            production-ready web applications.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Technical Specifications */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Technical Specifications</CardTitle>
            <CardDescription>Built with modern technologies and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Frontend Technologies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Next.js 14 with App Router</li>
                  <li>• React 18 with modern hooks</li>
                  <li>• TypeScript for type safety</li>
                  <li>• TailwindCSS for styling</li>
                  <li>• Responsive design patterns</li>
                  <li>• Modern UI components</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Backend & Infrastructure</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Next.js API Routes</li>
                  <li>• Server Actions for forms</li>
                  <li>• Database integration ready</li>
                  <li>• Authentication middleware</li>
                  <li>• Error handling & validation</li>
                  <li>• Environment configuration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Entrepreneurs</h3>
                <p className="text-sm text-muted-foreground">Quickly prototype and validate your business ideas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Developers</h3>
                <p className="text-sm text-muted-foreground">Speed up development and focus on unique features</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Designers</h3>
                <p className="text-sm text-muted-foreground">Turn designs into functional applications instantly</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Agencies</h3>
                <p className="text-sm text-muted-foreground">Deliver client projects faster and more efficiently</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start generating your first application today and see how our AI can transform your development workflow.
            </p>
            <Button size="lg" asChild>
              <Link href="/generator">
                Try It Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
