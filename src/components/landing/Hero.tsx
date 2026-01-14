import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Shield, Zap } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            <span>Now with OTP verification & JWT security</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Organize events{' '}
            <span className="text-gradient">effortlessly</span>
            <br />with your team
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Create, manage, and collaborate on events seamlessly. Invite participants
            via email and keep everyone in sync with real-time updates.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/login">
                Sign in to your account
              </Link>
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <FeaturePill icon={<Calendar className="w-4 h-4" />} text="Smart Scheduling" />
            <FeaturePill icon={<Users className="w-4 h-4" />} text="Team Collaboration" />
            <FeaturePill icon={<Shield className="w-4 h-4" />} text="Secure & Private" />
          </motion.div>
        </div>

        {/* Floating Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Main Dashboard Preview */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PreviewCard
                  title="Team Standup"
                  date="Today, 10:00 AM"
                  participants={4}
                  color="primary"
                />
                <PreviewCard
                  title="Product Launch"
                  date="Tomorrow, 2:00 PM"
                  participants={12}
                  color="accent"
                />
                <PreviewCard
                  title="Design Review"
                  date="Friday, 11:00 AM"
                  participants={6}
                  color="success"
                />
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 glass-card rounded-xl p-4 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">New participant joined</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturePill = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
    <span className="text-primary">{icon}</span>
    <span className="text-muted-foreground">{text}</span>
  </div>
);

const PreviewCard = ({
  title,
  date,
  participants,
  color,
}: {
  title: string;
  date: string;
  participants: number;
  color: 'primary' | 'accent' | 'success';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 border-primary/20',
    accent: 'bg-accent/10 border-accent/20',
    success: 'bg-success/10 border-success/20',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color]}`}>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{date}</p>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[...Array(Math.min(participants, 3))].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-muted border-2 border-background"
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          +{participants} participants
        </span>
      </div>
    </div>
  );
};
