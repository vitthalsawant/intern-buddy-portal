-- Create enum for achievement types
CREATE TYPE public.achievement_type AS ENUM ('badge', 'level', 'milestone');

-- Create enum for achievement status
CREATE TYPE public.achievement_status AS ENUM ('locked', 'unlocked');

-- Create profiles table for intern data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  total_raised DECIMAL(10,2) DEFAULT 0,
  avatar_url TEXT,
  level TEXT DEFAULT 'Bronze',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intern_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  donor_name TEXT,
  referral_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type achievement_type NOT NULL,
  threshold_amount DECIMAL(10,2),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  status achievement_status DEFAULT 'locked',
  unlocked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, achievement_id)
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intern_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  referred_by TEXT,
  amount_raised DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for donations
CREATE POLICY "Users can view their own donations" ON public.donations FOR SELECT USING (auth.uid() = intern_id);
CREATE POLICY "Users can insert their own donations" ON public.donations FOR INSERT WITH CHECK (auth.uid() = intern_id);

-- Create policies for achievements
CREATE POLICY "Everyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for referrals
CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = intern_id);
CREATE POLICY "Users can insert their own referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = intern_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  random_code TEXT;
BEGIN
  -- Generate unique referral code
  random_code := 'INTERN' || EXTRACT(YEAR FROM NOW()) || LPAD(floor(random() * 10000)::text, 4, '0');
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, display_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New Intern'),
    random_code
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample achievements
INSERT INTO public.achievements (name, description, type, threshold_amount, icon) VALUES
('First Steps', 'Raise your first ₹1,000', 'milestone', 1000.00, '🎯'),
('Rising Star', 'Reach ₹5,000 raised', 'badge', 5000.00, '⭐'),
('Champion', 'Achieve ₹10,000 raised', 'badge', 10000.00, '🏆'),
('Legend', 'Raise over ₹25,000', 'level', 25000.00, '👑'),
('Referral Master', 'Get 10 successful referrals', 'badge', null, '🔗'),
('Star Supporter', 'Maintain consistent donations', 'badge', null, '💫');