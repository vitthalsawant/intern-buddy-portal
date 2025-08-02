import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Users, TrendingUp, ArrowRight, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Badge className="px-4 py-2 text-sm font-medium">
              🎯 Make an Impact Today
            </Badge>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Welcome to Intern Portal
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of changemakers. Track your impact, earn rewards, 
              and help make a difference through fundraising and referrals.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 hover-scale shadow-elegant">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover-scale">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="hover-scale transition-all shadow-lg">
              <CardHeader className="text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Track Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your fundraising progress and see your real-time impact
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all shadow-lg">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Referral System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your unique referral code and earn rewards for every successful signup
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all shadow-lg">
              <CardHeader className="text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Unlock badges and levels as you reach fundraising milestones
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all shadow-lg">
              <CardHeader className="text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compete with other interns and see where you rank in fundraising
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 mt-16">
            <h2 className="text-2xl font-bold mb-6">Join Our Growing Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="text-muted-foreground">Active Interns</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹2M+</div>
                <p className="text-muted-foreground">Funds Raised</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <p className="text-muted-foreground">Causes Supported</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-1 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg italic text-center">
                "The Intern Portal has been amazing for tracking my fundraising goals. 
                The gamification aspect makes it so much more engaging!"
              </blockquote>
              <p className="text-center text-muted-foreground mt-4">
                - Sarah Johnson, Top Fundraiser 2024
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
