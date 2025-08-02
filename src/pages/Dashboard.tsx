import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Target, Users, TrendingUp, Copy, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  display_name: string;
  referral_code: string;
  total_raised: number;
  level: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  threshold_amount: number | null;
}

interface UserAchievement {
  achievement: Achievement;
  status: string;
  unlocked_at: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          status,
          unlocked_at,
          achievement:achievements(*)
        `)
        .eq('user_id', user?.id);

      if (achievementsError) {
        // If no achievements exist, create them
        await createUserAchievements();
      } else {
        setAchievements(achievementsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserAchievements = async () => {
    try {
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*');

      if (allAchievements) {
        // Create user achievements
        const userAchievements = allAchievements.map(achievement => ({
          user_id: user?.id,
          achievement_id: achievement.id,
          status: 'locked' as const
        }));

        await supabase
          .from('user_achievements')
          .insert(userAchievements);

        // Fetch the created achievements
        const { data: achievementsData } = await supabase
          .from('user_achievements')
          .select(`
            status,
            unlocked_at,
            achievement:achievements(*)
          `)
          .eq('user_id', user?.id);

        setAchievements(achievementsData || []);
      }
    } catch (error) {
      console.error('Error creating user achievements:', error);
    }
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard'
      });
    }
  };

  const shareReferral = () => {
    if (profile?.referral_code) {
      const shareText = `Join me in making a difference! Use my referral code: ${profile.referral_code}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join Intern Portal',
          text: shareText
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied!',
          description: 'Share text copied to clipboard'
        });
      }
    }
  };

  const progressPercentage = profile ? Math.min((profile.total_raised / 50000) * 100, 100) : 0;
  const unlockedAchievements = achievements.filter(a => a.status === 'unlocked').length;
  const totalAchievements = achievements.length;

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.display_name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your impact summary for today
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {profile?.level} Level
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-scale transition-all shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{profile?.total_raised.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +₹2,500 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.referral_code}</div>
              <p className="text-xs text-muted-foreground">
                12 successful referrals
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unlockedAchievements}/{totalAchievements}</div>
              <p className="text-xs text-muted-foreground">
                Badges unlocked
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <p className="text-xs text-muted-foreground">
                To ₹50,000 goal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Donations Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current: ₹{profile?.total_raised.toLocaleString()}</span>
                <span>Target: ₹50,000</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You're doing great! Keep sharing your referral code to reach your goal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Share Referral Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Your Referral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded-md font-mono text-sm">
                    {profile?.referral_code}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyReferralCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={shareReferral} className="transition-all hover:scale-105">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rewards & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((userAchievement) => (
                <div
                  key={userAchievement.achievement.id}
                  className={`p-4 rounded-lg border text-center transition-all hover-scale ${
                    userAchievement.status === 'unlocked'
                      ? 'bg-primary/10 border-primary shadow-lg'
                      : 'bg-muted/50 border-muted opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-2">{userAchievement.achievement.icon}</div>
                  <h4 className="font-semibold text-sm">{userAchievement.achievement.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userAchievement.achievement.description}
                  </p>
                  <Badge
                    variant={userAchievement.status === 'unlocked' ? 'default' : 'secondary'}
                    className="mt-2 text-xs"
                  >
                    {userAchievement.status === 'unlocked' ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Referral used by Alice - ₹1,500 raised</span>
                <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Unlocked 'Rising Star' badge</span>
                <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Referral used by Bob - ₹2,000 raised</span>
                <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}