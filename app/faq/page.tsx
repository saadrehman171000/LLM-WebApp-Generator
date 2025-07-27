"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I generate my first app?",
        answer:
          "Simply go to the Generator page, describe your app in the text area, and click 'Generate Full-Stack App'. Our AI will create a complete Next.js application based on your description.",
      },
      {
        question: "What kind of apps can I generate?",
        answer:
          "You can generate any type of web application including e-commerce sites, dashboards, blogs, social media apps, task managers, and more. The AI understands modern web development patterns and can create complex applications.",
      },
      {
        question: "Do I need coding experience?",
        answer:
          "No coding experience is required to generate apps. However, basic understanding of web development concepts will help you customize and extend the generated code.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "What technologies are used in generated apps?",
        answer:
          "All generated applications use Next.js 14 with App Router, TypeScript, TailwindCSS, and modern React patterns. API routes are included for backend functionality.",
      },
      {
        question: "Can I customize the generated code?",
        answer:
          "The generated code is clean, well-documented, and follows best practices. You can modify, extend, and customize it to meet your specific needs.",
      },
      {
        question: "How do I deploy my generated app?",
        answer:
          "Generated apps are ready for deployment on platforms like Vercel, Netlify, or any hosting service that supports Next.js. Each download includes deployment instructions.",
      },
      {
        question: "Are the generated apps production-ready?",
        answer:
          "Yes! The generated code follows industry best practices, includes proper error handling, TypeScript support, and is optimized for production deployment.",
      },
    ],
  },
  {
    category: "Features",
    questions: [
      {
        question: "Can I preview my app before downloading?",
        answer:
          "Yes! Every generated app includes a live preview feature where you can see your application running in different viewport sizes (desktop, tablet, mobile).",
      },
      {
        question: "What's included in the download?",
        answer:
          "Downloads include all source code, configuration files, package.json with dependencies, README with setup instructions, and example environment files.",
      },
      {
        question: "Can I generate apps with databases?",
        answer:
          "Yes! The AI can generate applications with database integration, including models, API routes for CRUD operations, and proper data handling patterns.",
      },
      {
        question: "Does it support authentication?",
        answer:
          "Yes! You can request authentication features in your prompt, and the AI will generate login/signup functionality, protected routes, and user management.",
      },
    ],
  },
  {
    category: "Pricing & Limits",
    questions: [
      {
        question: "Is there a free tier?",
        answer:
          "Yes! We offer a generous free tier that allows you to generate several apps per month. Check our Pricing page for current limits and features.",
      },
      {
        question: "What are the usage limits?",
        answer:
          "Limits vary by plan. Free users can generate up to 5 apps per month, while paid plans offer higher limits and additional features.",
      },
      {
        question: "Can I upgrade or downgrade my plan?",
        answer:
          "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        question: "How do I get help if I'm stuck?",
        answer:
          "You can contact our support team through the Contact page, join our Discord community, or check our documentation. We typically respond within 2-4 hours.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.",
      },
      {
        question: "Can I request new features?",
        answer:
          "We love hearing from our users. Send us your feature requests through our contact form or Discord community.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            FAQ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our AI Web App Generator
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`
                  const isOpen = openItems.includes(itemId)

                  return (
                    <Card key={itemId}>
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleItem(itemId)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      {isOpen && (
                        <CardContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && searchTerm && (
          <Card>
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">We couldn't find any questions matching "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
