import { buildNutritionPlan, suggestFoods } from '../utils/nutrition.js'

export function getNutrition(req, res) {
  const plan = buildNutritionPlan(req.user)
  const foods = suggestFoods(plan, req.user, 25)
  res.json({ success: true, plan, foods })
}
