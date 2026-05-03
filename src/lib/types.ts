export type MenuCategory = 'food' | 'alcohol' | 'wine' | 'desserts' | 'sushi'

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  ingredients: string
  description: string
  allergies: string
  flavor_profile: string
  image_url: string | null
  image_url_2: string | null
  image_url_3: string | null
  notes: string | null
  display_order: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'waiter' | 'bartender' | 'hostess' | 'shift_manager'
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  category: MenuCategory | 'general'
  explanation: string | null
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: MenuCategory | 'general'
  questions: QuizQuestion[]
  created_at: string
}

export interface TrainingMaterial {
  id: string
  title: string
  content: string
  video_url: string | null
  pdf_url: string | null
  display_order: number
  created_at: string
}
