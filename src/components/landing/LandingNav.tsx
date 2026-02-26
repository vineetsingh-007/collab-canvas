import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold gradient-text">CollabSphere</Link>
      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Sign In</Link>
        </Button>
        <Button asChild size="sm" className="gradient-primary text-primary-foreground rounded-lg">
          <Link to="/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  </nav>
);

export default LandingNav;
