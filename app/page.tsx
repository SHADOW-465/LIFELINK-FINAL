import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Shield, Zap, ChevronRight } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ImpactStories from "@/components/features/landing/ImpactStories";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-red-50 via-white to-white dark:from-red-950/20 dark:via-background dark:to-background pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-rose-200/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <MotionWrapper direction="down">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium text-sm mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Saving Lives, One Drop at a Time
              </div>
            </MotionWrapper>

            <MotionWrapper delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
                Connect. Donate. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                  Save a Life.
                </span>
              </h1>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the world&apos;s most connected blood donation community.
                Real-time alerts, seamless scheduling, and a chance to be a hero.
              </p>
            </MotionWrapper>

            <MotionWrapper delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-red-200 dark:shadow-none transition-all hover:scale-105">
                    Get Started Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full border-2 hover:bg-secondary transition-all">
                    Sign In
                  </Button>
                </Link>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 mb-24">
        <MotionWrapper direction="up" delay={0.4}>
          <div className="bg-white dark:bg-card rounded-3xl p-8 shadow-xl border border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
            {[
              { value: "10K+", label: "Lives Saved", color: "text-red-600" },
              { value: "5K+", label: "Active Donors", color: "text-rose-600" },
              { value: "2K+", label: "Requests Fulfilled", color: "text-orange-600" },
              { value: "50+", label: "Partner Hospitals", color: "text-blue-600" },
            ].map((stat, index) => (
              <div key={index} className="text-center px-2">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </MotionWrapper>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose LifeLink?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;ve reimagined the blood donation experience to be simple, fast, and rewarding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Community Driven",
              desc: "Join a supportive network of donors and recipients helping each other.",
              color: "bg-blue-100 text-blue-600"
            },
            {
              icon: Shield,
              title: "Secure & Private",
              desc: "Your health data is encrypted and protected with enterprise-grade security.",
              color: "bg-green-100 text-green-600"
            },
            {
              icon: Zap,
              title: "Real-time Alerts",
              desc: "Get notified instantly when someone near you needs your specific blood type.",
              color: "bg-yellow-100 text-yellow-600"
            }
          ].map((feature, index) => (
            <MotionWrapper key={index} delay={index * 0.2} direction="up">
              <div className="group p-8 rounded-3xl bg-white dark:bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-6 transition-transform group-hover:scale-110`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>

      {/* Impact Stories Section */}
      <div className="bg-secondary/30 py-24">
        <ImpactStories />
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <MotionWrapper>
          <div className="bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Save a Life Today?
              </h2>
              <p className="text-red-100 text-lg mb-8">
                Your donation can save up to three lives. Join our community of heroes and make a difference that lasts a lifetime.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-bold shadow-lg">
                  Become a Donor
                </Button>
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
