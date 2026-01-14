import { motion } from 'framer-motion';
import { Calendar, Users, Shield, Bell, Zap, Lock } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Event Creation',
    description: 'Create events with rich details including title, description, and flexible date ranges.',
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite participants via email and manage your team effortlessly.',
    color: 'accent',
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'JWT-based security with OTP verification for maximum protection.',
    color: 'success',
  },
  {
    icon: Bell,
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications about event changes.',
    color: 'warning',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'GraphQL-powered API for blazing fast performance and efficient data loading.',
    color: 'primary',
  },
  {
    icon: Lock,
    title: 'Rate Limited',
    description: 'Built-in protection against abuse with intelligent rate limiting.',
    color: 'accent',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Everything you need to manage events
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Powerful features designed to make event management simple and efficient.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};
