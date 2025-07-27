import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Star, Zap, Crown, Rocket } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our platform",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    features: [
      "5 app generations per month",
      "Basic templates",
      "Live preview",
      "Download source code",
      "Community support",
      "Basic documentation",
    ],
    limitations: ["Limited customization options", "Standard generation speed", "Community support only"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious developers and small teams",
    icon: Star,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    features: [
      "50 app generations per month",
      "Advanced templates",
      "Priority generation speed",
      "Custom styling options",
      "Database integration",
      "Authentication templates",
      "Email support",
      "Advanced documentation",
      "Export to GitHub",
      "Team collaboration (up to 3 members)",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For large teams and organizations",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    features: [
      "Unlimited app generations",
      "Custom AI model training",
      "White-label solution",
      "Advanced integrations",
      "Custom templates",
      "Priority support",
      "Dedicated account manager",
      "SLA guarantee",
      "Advanced analytics",
      "Unlimited team members",
      "Custom deployment options",
      "API access",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core AI generation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`h-8 w-8 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-muted-foreground">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <span className="text-muted-foreground text-sm">• {limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/generator"}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for
                    upgrades.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What happens if I exceed my limits?</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll be notified when approaching your limits. You can upgrade your plan or wait for the next
                    billing cycle.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our Free plan lets you try the platform. Pro and Enterprise plans include a 14-day free trial.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, PayPal, and can arrange invoicing for Enterprise customers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                    your billing period.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6 text-center">
            <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              For large organizations with specific requirements, we offer custom solutions including on-premise
              deployment, custom AI training, and dedicated support.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact Sales Team</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
