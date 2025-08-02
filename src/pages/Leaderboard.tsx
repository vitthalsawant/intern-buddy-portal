import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_raised: number;
  level: string;
  referral_code: string;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState<'week' | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll show all-time data
      // In a real app, you'd filter by date ranges for "This Week"
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, total_raised, level, referral_code')
        .order('total_raised', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Add some demo data if database is empty
      if (!data || data.length === 0) {
        const demoData = [
          { user_id: 'demo1', display_name: 'Sarah Johnson', total_raised: 25000, level: 'Gold', referral_code: 'INTERN20250001' },
          { user_id: 'demo2', display_name: 'Mike Chen', total_raised: 18500, level: 'Silver', referral_code: 'INTERN20250002' },
          { user_id: 'demo3', display_name: 'Emily Davis', total_raised: 15200, level: 'Silver', referral_code: 'INTERN20250003' },
          { user_id: 'demo4', display_name: 'Alex Rodriguez', total_raised: 12800, level: 'Bronze', referral_code: 'INTERN20250004' },
          { user_id: 'demo5', display_name: 'Jessica Wilson', total_raised: 11000, level: 'Bronze', referral_code: 'INTERN20250005' },
        ];
        setLeaderboard(demoData);
      } else {
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Silver': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'Bronze': return 'bg-amber-600/10 text-amber-700 border-amber-600/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const currentUserRank = leaderboard.findIndex(entry => entry.user_id === user?.id) + 1;

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
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
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              See how you stack up against other interns
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={timeFilter === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter('week')}
              className="transition-all hover-scale"
            >
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
            <Button
              variant={timeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter('all')}
              className="transition-all hover-scale"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              All Time
            </Button>
          </div>
        </div>

        {/* Current User Rank */}
        {currentUserRank > 0 && (
          <Card className="bg-primary/5 border-primary/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                    {getRankIcon(currentUserRank)}
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Rank</h3>
                    <p className="text-sm text-muted-foreground">
                      You're #{currentUserRank} out of {leaderboard.length} interns
                    </p>
                  </div>
                </div>
                <Badge className="px-3 py-1">
                  ₹{leaderboard[currentUserRank - 1]?.total_raised.toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd Place */}
            <Card className="hover-scale transition-all shadow-lg order-2 md:order-1">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
                <CardTitle className="text-lg">{leaderboard[1]?.display_name}</CardTitle>
                <Badge className={`mx-auto ${getLevelColor(leaderboard[1]?.level)}`}>
                  {leaderboard[1]?.level}
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">₹{leaderboard[1]?.total_raised.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{leaderboard[1]?.referral_code}</p>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="hover-scale transition-all shadow-xl scale-105 order-1 md:order-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Trophy className="h-10 w-10 text-yellow-500" />
                </div>
                <CardTitle className="text-xl">{leaderboard[0]?.display_name}</CardTitle>
                <Badge className={`mx-auto ${getLevelColor(leaderboard[0]?.level)}`}>
                  {leaderboard[0]?.level} Champion
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">₹{leaderboard[0]?.total_raised.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{leaderboard[0]?.referral_code}</p>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="hover-scale transition-all shadow-lg order-3">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-lg">{leaderboard[2]?.display_name}</CardTitle>
                <Badge className={`mx-auto ${getLevelColor(leaderboard[2]?.level)}`}>
                  {leaderboard[2]?.level}
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold">₹{leaderboard[2]?.total_raised.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{leaderboard[2]?.referral_code}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Complete Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-[1.02] ${
                    entry.user_id === user?.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {entry.display_name}
                        {entry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{entry.referral_code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{entry.total_raised.toLocaleString()}</div>
                    <Badge className={`text-xs ${getLevelColor(entry.level)}`}>
                      {entry.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}