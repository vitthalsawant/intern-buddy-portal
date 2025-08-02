import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Copy, Share2, Edit, Save, X, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  display_name: string;
  referral_code: string;
  total_raised: number;
  level: string;
  avatar_url: string | null;
}

interface UserAchievement {
  achievement: {
    name: string;
    icon: string;
    description: string;
  };
  status: string;
  unlocked_at: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setEditName(profileData.display_name);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          status,
          unlocked_at,
          achievement:achievements(name, icon, description)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'unlocked');

      setAchievements(achievementsData || []);

    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: editName })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: editName } : null);
      setEditing(false);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
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

  const shareProfile = () => {
    if (profile) {
      const shareText = `Check out my intern profile! I've raised ₹${profile.total_raised.toLocaleString()} and achieved ${profile.level} level. Join me with referral code: ${profile.referral_code}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Intern Profile',
          text: shareText
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied!',
          description: 'Profile info copied to clipboard'
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <Skeleton className="h-96" />
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-8 w-8" />
            My Profile
          </h1>
          <Button onClick={shareProfile} className="transition-all hover:scale-105">
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Information
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editing ? setEditing(false) : setEditing(true)}
                  >
                    {editing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <div className="flex gap-2">
                          <Input
                            id="name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={updateProfile} size="sm">
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">{profile?.display_name}</h2>
                        <Badge className="mt-2">{profile?.level} Level</Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm text-muted-foreground">Total Raised</h3>
                    <p className="text-2xl font-bold">₹{profile?.total_raised.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm text-muted-foreground">Achievements</h3>
                    <p className="text-2xl font-bold">{achievements.length}</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <Label>Your Referral Code</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-4 py-2 rounded-md font-mono flex-1">
                      {profile?.referral_code}
                    </code>
                    <Button variant="outline" size="sm" onClick={copyReferralCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this code with others to track your referrals and earn rewards!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <p className="text-sm text-muted-foreground">Successful Referrals</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">₹12,000</div>
                    <p className="text-sm text-muted-foreground">From Referrals</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Sidebar */}
          <Card className="shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Earned Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((userAchievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                    >
                      <div className="text-2xl">{userAchievement.achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{userAchievement.achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {userAchievement.achievement.description}
                        </p>
                        {userAchievement.unlocked_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start sharing your referral code to unlock achievements!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}