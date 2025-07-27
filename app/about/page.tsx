import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, Heart, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Building the Future of Web Development</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to democratize web development by making it accessible to everyone through the power of
            AI. Our platform transforms ideas into production-ready applications in seconds.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower creators, entrepreneurs, and developers by providing AI-powered tools that eliminate the
                barriers between ideas and implementation. We believe everyone should be able to build their vision
                without needing years of coding experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where creating software is as easy as describing what you want to build. We envision a future
                where AI handles the technical complexity, allowing humans to focus on creativity, innovation, and
                solving real problems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>User-Centric</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Every decision we make is guided by what's best for our users. We listen, learn, and iterate based on
                  real feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from code quality to user experience to customer
                  support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Passion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  We're passionate about technology, innovation, and helping people bring their ideas to life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
            <CardDescription>How we started and where we're going</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              AI Web App Generator was born from a simple frustration: building web applications was too complex and
              time-consuming. Our founders, experienced developers themselves, saw how many great ideas never made it to
              production because of technical barriers.
            </p>
            <p className="text-muted-foreground">
              In 2024, we set out to change that. By combining cutting-edge AI technology with deep understanding of
              modern web development practices, we created a platform that can generate production-ready applications
              from simple descriptions.
            </p>
            <p className="text-muted-foreground">
              Today, thousands of developers, entrepreneurs, and creators use our platform to bring their ideas to life.
              We're just getting started on our mission to democratize web development and make building software
              accessible to everyone.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">AS</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Alex Smith</h3>
                <p className="text-muted-foreground mb-2">CEO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  Former Google engineer with 10+ years in AI and web development. Passionate about making technology
                  accessible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">SJ</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-muted-foreground mb-2">CTO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  AI researcher and full-stack developer. Expert in machine learning and modern web technologies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">MD</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mike Davis</h3>
                <p className="text-muted-foreground mb-2">Head of Product</p>
                <p className="text-sm text-muted-foreground">
                  Product strategist with experience at top tech companies. Focused on user experience and product
                  innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">By the Numbers</CardTitle>
            <CardDescription className="text-center">Our impact so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Apps Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
