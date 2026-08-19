export const ACTIVITY_FACTORS = {
  'خامل': 1.2,
  'خفيف النشاط': 1.375,
  'نشاط متوسط': 1.55,
  'نشاط عالي': 1.725,
  'نشاط شديد': 1.9,
}

export const GOAL_PRIORITY = ['إنقاص الوزن', 'زيادة الوزن', 'بناء العضلات', 'الحفاظ على اللياقة', 'تثبيت الوزن']

export function pickPrimaryGoal(goals = []) {
  if (!goals.length) return null
  return GOAL_PRIORITY.find((goal) => goals.includes(goal)) ?? goals[0]
}

export function calculateBMI(weight, height) {
  const heightM = height / 100
  const value = weight / (heightM * heightM)
  let category = 'وزن مثالي'
  if (value < 18.5) category = 'نحافة'
  else if (value >= 30) category = 'سمنة'
  else if (value >= 25) category = 'زيادة وزن'
  return { value: Math.round(value * 10) / 10, category }
}

export function calculateBMR({ gender, weight, height, age }) {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'أنثى' ? base - 161 : base + 5
}

export function calculateTDEE(bmr, activity) {
  return bmr * (ACTIVITY_FACTORS[activity] ?? 1.2)
}

const CALORIE_ADJUSTMENTS = {
  'إنقاص الوزن': -500,
  'زيادة الوزن': 500,
  'بناء العضلات': 300,
  'الحفاظ على اللياقة': 0,
  'تثبيت الوزن': 0,
}

const PROTEIN_PER_KG = {
  'إنقاص الوزن': 2,
  'زيادة الوزن': 2,
  'بناء العضلات': 2.2,
  'الحفاظ على اللياقة': 1.6,
  'تثبيت الوزن': 1.6,
}

const FAT_PERCENT = {
  'إنقاص الوزن': 0.25,
  'زيادة الوزن': 0.3,
  'بناء العضلات': 0.25,
  'الحفاظ على اللياقة': 0.28,
  'تثبيت الوزن': 0.28,
}

export function calculateMacros(dailyCalories, weight, goal) {
  const protein = Math.round(PROTEIN_PER_KG[goal] * weight)
  const fat = Math.round((dailyCalories * FAT_PERCENT[goal]) / 9)
  const carbs = Math.round(Math.max((dailyCalories - protein * 4 - fat * 9) / 4, 0))
  return { protein, carbs, fat }
}

export function buildNutritionPlan(user) {
  const { age, gender, height, weight, activity, goals } = user
  if (!age || !gender || !height || !weight || !activity || !goals.length) {
    return {
      bmi: null,
      bmiCategory: null,
      bmr: null,
      tdee: null,
      dailyCalories: null,
      primaryGoal: null,
      protein: null,
      carbs: null,
      fat: null,
      water: null,
    }
  }

  const bmi = calculateBMI(weight, height)
  const bmr = calculateBMR({ gender, weight, height, age })
  const tdee = calculateTDEE(bmr, activity)
  const primaryGoal = pickPrimaryGoal(goals)
  const dailyCalories = Math.max(Math.round(tdee + (CALORIE_ADJUSTMENTS[primaryGoal] ?? 0)), 1200)
  const macros = calculateMacros(dailyCalories, weight, primaryGoal)

  return {
    bmi: bmi.value,
    bmiCategory: bmi.category,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories,
    primaryGoal,
    ...macros,
    water: Math.round((weight * 35) / 100) / 10,
  }
}

export const FOOD_DATABASE = [
  {
    name: 'كسكس بالخضار',
    category: 'أطباق رئيسية',
    per100g: { cal: 112, protein: 3.8, carbs: 20, fat: 1.6 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'رشتة',
    category: 'أطباق رئيسية',
    per100g: { cal: 130, protein: 4, carbs: 24, fat: 2 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'شخشوخة',
    category: 'أطباق رئيسية',
    per100g: { cal: 160, protein: 5, carbs: 22, fat: 6 },
    goals: ['تثبيت الوزن'],
  },
  {
    name: 'تاجين الزيتون',
    category: 'أطباق رئيسية',
    per100g: { cal: 185, protein: 14, carbs: 6, fat: 12 },
    goals: ['بناء العضلات', 'زيادة الوزن'],
  },
  {
    name: 'مقرونة بالطماطم',
    category: 'أطباق رئيسية',
    per100g: { cal: 130, protein: 5, carbs: 22, fat: 3 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'كسكس باللحم',
    category: 'أطباق رئيسية',
    per100g: { cal: 150, protein: 10, carbs: 18, fat: 4 },
    goals: ['بناء العضلات', 'تثبيت الوزن'],
  },
  {
    name: 'محاجب',
    category: 'أطباق رئيسية',
    per100g: { cal: 280, protein: 7, carbs: 38, fat: 12 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'عجة بالبطاطا',
    category: 'أطباق رئيسية',
    per100g: { cal: 220, protein: 9, carbs: 15, fat: 14 },
    goals: ['تثبيت الوزن', 'زيادة الوزن'],
  },
  {
    name: 'طاجين الكبدة',
    category: 'أطباق رئيسية',
    per100g: { cal: 180, protein: 18, carbs: 5, fat: 10 },
    goals: ['بناء العضلات'],
  },
  {
    name: 'شوربة الحريرة',
    category: 'أطباق رئيسية',
    per100g: { cal: 55, protein: 3.5, carbs: 8, fat: 1 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'شوربة الشعيرية',
    category: 'أطباق رئيسية',
    per100g: { cal: 42, protein: 1.6, carbs: 7, fat: 0.8 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن'],
  },
  {
    name: 'شوربة العدس',
    category: 'أطباق رئيسية',
    per100g: { cal: 90, protein: 6, carbs: 14, fat: 1 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'شوربة الخضار',
    category: 'أطباق رئيسية',
    per100g: { cal: 45, protein: 1.5, carbs: 8, fat: 1 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'شوربة الدجاج',
    category: 'أطباق رئيسية',
    per100g: { cal: 70, protein: 6, carbs: 8, fat: 2 },
    goals: ['إنقاص الوزن', 'بناء العضلات', 'الحفاظ على اللياقة'],
  },
  {
    name: 'لحم بقري',
    category: 'بروتينات',
    per100g: { cal: 250, protein: 26, carbs: 0, fat: 15 },
    goals: ['بناء العضلات', 'زيادة الوزن'],
  },
  {
    name: 'لحم غنم',
    category: 'بروتينات',
    per100g: { cal: 294, protein: 25, carbs: 0, fat: 21 },
    goals: ['بناء العضلات', 'زيادة الوزن'],
  },
  {
    name: 'لحم مفروم قليل الدهن',
    category: 'بروتينات',
    per100g: { cal: 216, protein: 24, carbs: 0, fat: 13 },
    goals: ['بناء العضلات', 'إنقاص الوزن'],
  },
  {
    name: 'كبدة دجاج',
    category: 'بروتينات',
    per100g: { cal: 119, protein: 17, carbs: 0.7, fat: 4.8 },
    goals: ['بناء العضلات', 'إنقاص الوزن'],
  },
  {
    name: 'كفتة مشوية',
    category: 'بروتينات',
    per100g: { cal: 250, protein: 20, carbs: 2, fat: 18 },
    goals: ['بناء العضلات', 'زيادة الوزن'],
  },
  {
    name: 'دجاج مشوي',
    category: 'بروتينات',
    per100g: { cal: 165, protein: 31, carbs: 0, fat: 3.6 },
    goals: ['بناء العضلات', 'إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'صدر دجاج مقلي',
    category: 'بروتينات',
    per100g: { cal: 223, protein: 25, carbs: 0.6, fat: 13 },
    goals: ['بناء العضلات'],
  },
  {
    name: 'دجاج بالكاري',
    category: 'بروتينات',
    per100g: { cal: 165, protein: 30, carbs: 3, fat: 4 },
    goals: ['بناء العضلات', 'إنقاص الوزن'],
  },
  {
    name: 'ديك رومي مشوي',
    category: 'بروتينات',
    per100g: { cal: 135, protein: 29, carbs: 0, fat: 1.5 },
    goals: ['بناء العضلات', 'إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'سردين مشوي',
    category: 'بروتينات',
    per100g: { cal: 208, protein: 25, carbs: 0, fat: 11 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'سمك تونة',
    category: 'بروتينات',
    per100g: { cal: 132, protein: 29, carbs: 0, fat: 1 },
    goals: ['بناء العضلات', 'إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'سلمون مشوي',
    category: 'بروتينات',
    per100g: { cal: 208, protein: 20, carbs: 0, fat: 13 },
    goals: ['بناء العضلات', 'الحفاظ على اللياقة'],
  },
  {
    name: 'سمك القد',
    category: 'بروتينات',
    per100g: { cal: 82, protein: 18, carbs: 0, fat: 0.7 },
    goals: ['إنقاص الوزن', 'بناء العضلات', 'الحفاظ على اللياقة'],
  },
  {
    name: 'بيض مسلوق',
    category: 'بروتينات',
    per100g: { cal: 155, protein: 13, carbs: 1.1, fat: 11 },
    goals: ['بناء العضلات', 'إنقاص الوزن', 'زيادة الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'أومليت بالجبن',
    category: 'بروتينات',
    per100g: { cal: 190, protein: 12, carbs: 1.5, fat: 15 },
    goals: ['بناء العضلات', 'تثبيت الوزن'],
  },
  {
    name: 'بياض البيض',
    category: 'بروتينات',
    per100g: { cal: 52, protein: 11, carbs: 0.7, fat: 0.2 },
    goals: ['بناء العضلات', 'إنقاص الوزن'],
  },
  {
    name: 'عدس',
    category: 'بروتينات',
    per100g: { cal: 116, protein: 9, carbs: 20, fat: 0.4 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'حمص مسلوق',
    category: 'بروتينات',
    per100g: { cal: 164, protein: 8.9, carbs: 27, fat: 2.6 },
    goals: ['بناء العضلات', 'إنقاص الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'فاصولياء بيضاء',
    category: 'بروتينات',
    per100g: { cal: 127, protein: 8.7, carbs: 23, fat: 0.5 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'أرز بني',
    category: 'كربوهيدرات',
    per100g: { cal: 123, protein: 2.7, carbs: 26, fat: 1 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'شوفان',
    category: 'كربوهيدرات',
    per100g: { cal: 389, protein: 17, carbs: 66, fat: 7 },
    goals: ['بناء العضلات', 'زيادة الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'ذرة مسلوقة',
    category: 'كربوهيدرات',
    per100g: { cal: 96, protein: 3.4, carbs: 21, fat: 1.5 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'مكرونة إسباجيتي',
    category: 'كربوهيدرات',
    per100g: { cal: 131, protein: 5, carbs: 25, fat: 1.1 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'خبز القمح الكامل',
    category: 'كربوهيدرات',
    per100g: { cal: 247, protein: 13, carbs: 41, fat: 3.4 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'خبز الشعير',
    category: 'كربوهيدرات',
    per100g: { cal: 240, protein: 8, carbs: 45, fat: 2 },
    goals: ['تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'فطيرة باللحم',
    category: 'كربوهيدرات',
    per100g: { cal: 320, protein: 12, carbs: 35, fat: 15 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'بطاطا مسلوقة',
    category: 'خضار وفواكه',
    per100g: { cal: 87, protein: 1.9, carbs: 20, fat: 0.1 },
    goals: ['زيادة الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'بروكلي مسلوق',
    category: 'خضار وفواكه',
    per100g: { cal: 35, protein: 2.4, carbs: 7, fat: 0.4 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'سبانخ',
    category: 'خضار وفواكه',
    per100g: { cal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'جزر مسلوق',
    category: 'خضار وفواكه',
    per100g: { cal: 35, protein: 0.8, carbs: 8, fat: 0.2 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'كوسة',
    category: 'خضار وفواكه',
    per100g: { cal: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'باذنجان مشوي',
    category: 'خضار وفواكه',
    per100g: { cal: 35, protein: 1, carbs: 9, fat: 0.2 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'موز',
    category: 'خضار وفواكه',
    per100g: { cal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'تفاح',
    category: 'خضار وفواكه',
    per100g: { cal: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'أفوكادو',
    category: 'خضار وفواكه',
    per100g: { cal: 160, protein: 2, carbs: 9, fat: 15 },
    goals: ['زيادة الوزن', 'بناء العضلات', 'الحفاظ على اللياقة'],
  },
  {
    name: 'برتقال',
    category: 'خضار وفواكه',
    per100g: { cal: 47, protein: 0.9, carbs: 12, fat: 0.1 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'عنب',
    category: 'خضار وفواكه',
    per100g: { cal: 69, protein: 0.7, carbs: 18, fat: 0.2 },
    goals: ['تثبيت الوزن'],
  },
  {
    name: 'تمر',
    category: 'خضار وفواكه',
    per100g: { cal: 277, protein: 1.8, carbs: 75, fat: 0.2 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'بطيخ',
    category: 'خضار وفواكه',
    per100g: { cal: 30, protein: 0.6, carbs: 8, fat: 0.2 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'سلطة الخيار بالزبادي',
    category: 'خضار وفواكه',
    per100g: { cal: 50, protein: 2, carbs: 5, fat: 2.5 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'سلطة الطماطم والبصل',
    category: 'خضار وفواكه',
    per100g: { cal: 25, protein: 1, carbs: 5, fat: 0.2 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'لبن / رايب',
    category: 'ألبان ومكسرات',
    per100g: { cal: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'جبنة صفراء',
    category: 'ألبان ومكسرات',
    per100g: { cal: 402, protein: 25, carbs: 3.2, fat: 33 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'حليب خالي الدسم',
    category: 'ألبان ومكسرات',
    per100g: { cal: 34, protein: 3.4, carbs: 5, fat: 0.1 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'لوز',
    category: 'ألبان ومكسرات',
    per100g: { cal: 579, protein: 21, carbs: 22, fat: 50 },
    goals: ['زيادة الوزن', 'بناء العضلات', 'الحفاظ على اللياقة'],
  },
  {
    name: 'فول سوداني',
    category: 'ألبان ومكسرات',
    per100g: { cal: 567, protein: 26, carbs: 16, fat: 49 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'جوز',
    category: 'ألبان ومكسرات',
    per100g: { cal: 654, protein: 15, carbs: 14, fat: 65 },
    goals: ['زيادة الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'كاجو',
    category: 'ألبان ومكسرات',
    per100g: { cal: 553, protein: 18, carbs: 30, fat: 44 },
    goals: ['زيادة الوزن', 'بناء العضلات'],
  },
  {
    name: 'بندق',
    category: 'ألبان ومكسرات',
    per100g: { cal: 628, protein: 15, carbs: 17, fat: 61 },
    goals: ['زيادة الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'زيت الزيتون',
    category: 'ألبان ومكسرات',
    per100g: { cal: 884, protein: 0, carbs: 0, fat: 100 },
    goals: ['زيادة الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'زبدة',
    category: 'ألبان ومكسرات',
    per100g: { cal: 717, protein: 0.9, carbs: 0.1, fat: 81 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'عصير برتقال طازج',
    category: 'مشروبات وحلويات',
    per100g: { cal: 45, protein: 0.7, carbs: 10, fat: 0.2 },
    goals: ['الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'حليب اللوز',
    category: 'مشروبات وحلويات',
    per100g: { cal: 15, protein: 0.6, carbs: 0.6, fat: 1.2 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'شاي أخضر',
    category: 'مشروبات وحلويات',
    per100g: { cal: 1, protein: 0, carbs: 0.2, fat: 0 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة', 'تثبيت الوزن'],
  },
  {
    name: 'قهوة',
    category: 'مشروبات وحلويات',
    per100g: { cal: 2, protein: 0.1, carbs: 0.4, fat: 0 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
  {
    name: 'تمر محشي باللوز',
    category: 'مشروبات وحلويات',
    per100g: { cal: 350, protein: 5, carbs: 70, fat: 7 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'مقروط',
    category: 'مشروبات وحلويات',
    per100g: { cal: 380, protein: 6, carbs: 60, fat: 14 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'غريبة',
    category: 'مشروبات وحلويات',
    per100g: { cal: 480, protein: 5, carbs: 50, fat: 30 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'شوكولاتة داكنة',
    category: 'مشروبات وحلويات',
    per100g: { cal: 546, protein: 7.8, carbs: 46, fat: 31 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'صلصة الطماطم',
    category: 'مشروبات وحلويات',
    per100g: { cal: 42, protein: 2, carbs: 8, fat: 0.2 },
    goals: ['إنقاص الوزن', 'تثبيت الوزن'],
  },
  {
    name: 'عسل',
    category: 'مشروبات وحلويات',
    per100g: { cal: 304, protein: 0.3, carbs: 82, fat: 0 },
    goals: ['زيادة الوزن'],
  },
  {
    name: 'صلصة الخردل',
    category: 'مشروبات وحلويات',
    per100g: { cal: 66, protein: 4.4, carbs: 6, fat: 3.3 },
    goals: ['إنقاص الوزن', 'الحفاظ على اللياقة'],
  },
]

const DENSITY_PREFERENCE = {
  'إنقاص الوزن': 'low',
  'زيادة الوزن': 'high',
  'بناء العضلات': 'balanced',
  'الحفاظ على اللياقة': 'balanced',
  'تثبيت الوزن': 'balanced',
}

const FOOD_CATEGORIES = ['أطباق رئيسية', 'بروتينات', 'كربوهيدرات', 'خضار وفواكه', 'ألبان ومكسرات', 'مشروبات وحلويات']

function foodFit(food, plan, primaryGoal, secondaryGoals) {
  const cal = food.per100g.cal
  if (cal <= 0 || !plan?.dailyCalories) return 5

  const pKcal = food.per100g.protein * 4
  const cKcal = food.per100g.carbs * 4
  const fKcal = food.per100g.fat * 9

  let score = 0

  if (food.goals.includes(primaryGoal)) score += 38
  else if (food.goals.length) score += 10
  for (const goal of secondaryGoals) {
    if (food.goals.includes(goal)) score += 6
  }
  score = Math.min(score, 50)

  const targetP = (plan.protein * 4) / plan.dailyCalories
  const targetC = (plan.carbs * 4) / plan.dailyCalories
  const targetF = (plan.fat * 9) / plan.dailyCalories
  const macroDiff =
    Math.abs(pKcal / cal - targetP) + Math.abs(cKcal / cal - targetC) + Math.abs(fKcal / cal - targetF)
  score += Math.max(0, 25 - macroDiff * 22)

  const preference = DENSITY_PREFERENCE[primaryGoal] ?? 'balanced'
  if (preference === 'low') {
    if (cal <= 120) score += 16
    else if (cal <= 220) score += 11
    else score += Math.max(3, 16 - (cal - 220) / 35)
    score += Math.min(9, pKcal / cal / 0.4)
  } else if (preference === 'high') {
    if (cal >= 320) score += 16
    else if (cal >= 200) score += 11
    else score += Math.max(3, cal / 22)
    score += Math.min(9, pKcal / cal / 0.35)
  } else {
    score += cal >= 500 ? 7 : 13
    score += Math.min(12, pKcal / cal / 0.3)
  }

  return Math.max(5, Math.min(100, Math.round(score)))
}

export function suggestFoods(plan, user, limit = 25) {
  const primaryGoal = plan?.primaryGoal
  if (!primaryGoal) return []

  const goals = Array.isArray(user?.goals) ? user.goals : []
  const secondaryGoals = goals.filter((goal) => goal !== primaryGoal)
  const hasPlan = Boolean(plan?.dailyCalories)

  const scored = FOOD_DATABASE.map((food) => ({
    food,
    fit: hasPlan ? foodFit(food, plan, primaryGoal, secondaryGoals) : food.goals.includes(primaryGoal) ? 75 : 40,
  })).filter((entry) => entry.fit >= 20)

  scored.sort(
    (a, b) =>
      b.fit - a.fit ||
      FOOD_CATEGORIES.indexOf(a.food.category) - FOOD_CATEGORIES.indexOf(b.food.category) ||
      a.food.name.localeCompare(b.food.name, 'ar')
  )

  const picked = []
  const counts = {}
  const perCategoryMax = Math.max(2, Math.ceil(limit / FOOD_CATEGORIES.length))

  for (const entry of scored) {
    if (picked.length >= limit) break
    const category = entry.food.category
    counts[category] = counts[category] ?? 0
    if (counts[category] >= perCategoryMax) continue
    picked.push(entry)
    counts[category] += 1
  }

  for (const entry of scored) {
    if (picked.length >= limit) break
    if (picked.includes(entry)) continue
    picked.push(entry)
  }

  return picked.map((entry) => ({ ...entry.food, fit: entry.fit }))
}
