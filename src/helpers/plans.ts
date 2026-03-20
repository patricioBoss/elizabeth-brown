export interface Plan {
  id: number;
  name: string;
  interest: number;
  minimum: number;
  maximum: number;
}

const plans: Plan[] = [
  {
    id: 1,
    name: 'starter level',
    interest: 10,
    minimum: 100,
    maximum: 4999,
  },
  {
    id: 2,
    name: 'bronze level',
    interest: 14,
    minimum: 5000,
    maximum: 49999,
  },
  {
    id: 3,
    name: 'sliver level',
    interest: 17,
    minimum: 10000,
    maximum: 49999,
  },
  {
    id: 4,
    name: 'gold level',
    interest: 21,
    minimum: 50000,
    maximum: 119999,
  },
  {
    id: 5,
    name: 'platinum level',
    interest: 25,
    minimum: 120000,
    maximum: 1000000,
  },
];

export default plans;
