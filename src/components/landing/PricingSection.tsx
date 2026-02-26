import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '$0',
    period: '/month',
    description: 'For individuals and small teams',
    features: ['Up to 5 projects', '10 team members', 'Basic analytics', 'Email support'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/user/mo',
    description: 'For growing teams that need more',
    features: ['Unlimited projects', 'Unlimited members', 'Advanced analytics', 'Priority support', 'Custom workflows', 'API access'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'Custom integrations', 'On-premise option'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const PricingSection = () => (
  <section className="py-24 bg-muted/30" id="pricing">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-muted-foreground text-lg">No hidden fees. Start free and scale as you grow.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`relative p-8 rounded-2xl border bg-card ${plan.popular ? 'border-primary shadow-glow' : 'border-border shadow-card'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-secondary" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild className={`w-full rounded-xl ${plan.popular ? 'gradient-primary text-primary-foreground' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
              <Link to="/signup">{plan.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
