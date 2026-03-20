import plans, { Plan } from '@/helpers/plans';

export default function getNextPlanId(totalTopUp: number): Plan {
  let highPlan = plans.reduce((acc, plan, index) => {
    if (totalTopUp > plan.minimum && plan.maximum <= totalTopUp) {
      acc = index;
    }
    return acc;
  }, 0);

  if (highPlan === 0 && totalTopUp > plans[plans.length - 1].maximum) {
    return plans[plans.length - 1];
  }

  return plans[highPlan];
}
