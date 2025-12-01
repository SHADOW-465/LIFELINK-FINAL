import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              LifeLink
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with the blood donation community. Save lives, make a difference, 
              and be part of something bigger than yourself.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
                GET STARTED
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join thousands of donors and recipients in a supportive community
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time</h3>
              <p className="text-gray-600">
                Get instant notifications for urgent blood requests
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Making a Difference</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">5K+</div>
                <div className="text-sm text-gray-600">Active Donors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">2K+</div>
                <div className="text-sm text-gray-600">Requests Fulfilled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Hospitals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
