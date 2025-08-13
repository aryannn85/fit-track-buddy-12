import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Activity, Apple, Dumbbell, Target, TrendingUp, Plus } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';

interface DailySummary {
  total_calories_consumed: number;
  total_calories_burned: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

interface UserProfile {
  daily_calorie_goal: number;
  display_name: string;
  weight_kg: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState<DailySummary>({
    total_calories_consumed: 0,
    total_calories_burned: 0,
    total_protein_g: 0,
    total_carbs_g: 0,
    total_fat_g: 0,
  });
  const [profile, setProfile] = useState<UserProfile>({
    daily_calorie_goal: 2000,
    display_name: '',
    weight_kg: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('daily_calorie_goal, display_name, weight_kg')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch today's summary
      const { data: summaryData } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', user?.id)
        .eq('summary_date', today)
        .single();

      if (summaryData) {
        setSummary(summaryData);
      } else {
        // Calculate summary from meals and workouts
        await calculateTodaysSummary();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTodaysSummary = async () => {
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);

    // Get today's meals
    const { data: meals } = await supabase
      .from('meals')
      .select('calories, protein_g, carbs_g, fat_g')
      .eq('user_id', user?.id)
      .gte('meal_time', startDay.toISOString())
      .lte('meal_time', endDay.toISOString());

    // Get today's workouts
    const { data: workouts } = await supabase
      .from('workouts')
      .select('calories_burned')
      .eq('user_id', user?.id)
      .gte('workout_date', startDay.toISOString())
      .lte('workout_date', endDay.toISOString());

    const calculatedSummary = {
      total_calories_consumed: meals?.reduce((sum, meal) => sum + Number(meal.calories), 0) || 0,
      total_calories_burned: workouts?.reduce((sum, workout) => sum + Number(workout.calories_burned), 0) || 0,
      total_protein_g: meals?.reduce((sum, meal) => sum + Number(meal.protein_g), 0) || 0,
      total_carbs_g: meals?.reduce((sum, meal) => sum + Number(meal.carbs_g), 0) || 0,
      total_fat_g: meals?.reduce((sum, meal) => sum + Number(meal.fat_g), 0) || 0,
    };

    setSummary(calculatedSummary);

    // Save to daily_summaries
    const today_str = format(today, 'yyyy-MM-dd');
    await supabase
      .from('daily_summaries')
      .upsert({
        user_id: user?.id,
        summary_date: today_str,
        ...calculatedSummary,
      });
  };

  const caloriesRemaining = profile.daily_calorie_goal - summary.total_calories_consumed + summary.total_calories_burned;
  const progressPercentage = Math.min((summary.total_calories_consumed / profile.daily_calorie_goal) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile.display_name || 'User'}!</h1>
            <p className="text-muted-foreground">Today is {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout
            </Button>
          </div>
        </div>

        {/* Calorie Overview */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Calorie Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Goal: {profile.daily_calorie_goal} cal</span>
                <span>Consumed: {Math.round(summary.total_calories_consumed)} cal</span>
                <span>Burned: {Math.round(summary.total_calories_burned)} cal</span>
                <span className={`font-semibold ${caloriesRemaining >= 0 ? 'text-success' : 'text-warning'}`}>
                  Remaining: {Math.round(caloriesRemaining)} cal
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Consumed</CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.total_calories_consumed)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((summary.total_calories_consumed / profile.daily_calorie_goal) * 100)}% of goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.total_calories_burned)}</div>
              <p className="text-xs text-muted-foreground">Through exercise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.total_protein_g)}g</div>
              <p className="text-xs text-muted-foreground">Today's intake</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Calories</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.total_calories_consumed - summary.total_calories_burned)}</div>
              <p className="text-xs text-muted-foreground">Consumed - Burned</p>
            </CardContent>
          </Card>
        </div>

        {/* Macronutrients */}
        <Card>
          <CardHeader>
            <CardTitle>Macronutrients Breakdown</CardTitle>
            <CardDescription>Today's macronutrient distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-info">{Math.round(summary.total_protein_g)}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
                <div className="text-xs text-muted-foreground">{Math.round(summary.total_protein_g * 4)} cal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{Math.round(summary.total_carbs_g)}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
                <div className="text-xs text-muted-foreground">{Math.round(summary.total_carbs_g * 4)} cal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{Math.round(summary.total_fat_g)}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
                <div className="text-xs text-muted-foreground">{Math.round(summary.total_fat_g * 9)} cal</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}