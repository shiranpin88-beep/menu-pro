-- ========================================
-- SUN YOUNG — הגדרת מסד הנתונים
-- הרץ את זה ב-Supabase SQL Editor
-- ========================================

-- טבלת פרופילים (משתמשים)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- טבלת מנות תפריט
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'alcohol', 'wine')),
  ingredients TEXT,
  description TEXT,
  allergies TEXT,
  flavor_profile TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- טבלת מבחנים
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('food', 'alcohol', 'wine', 'general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- טבלת שאלות מבחן
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  display_order INTEGER DEFAULT 0
);

-- טבלת הדרכות
CREATE TABLE training_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  pdf_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- RLS (Row Level Security)
-- ========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_materials ENABLE ROW LEVEL SECURITY;

-- משתמשים מחוברים רואים הכל
CREATE POLICY "authenticated read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read menu" ON menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read quizzes" ON quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read questions" ON quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read training" ON training_materials FOR SELECT TO authenticated USING (true);

-- רק אדמין יכול לכתוב (דרך service role - נעשה מה-API)
-- אין צורך ב-policy נוסף כי ה-API משתמש ב-service role

-- ========================================
-- Trigger: יצירת פרופיל אוטומטית בהרשמה
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'employee')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- Storage bucket לתמונות
-- ========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "authenticated upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images');
