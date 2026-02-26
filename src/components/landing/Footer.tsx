const Footer = () => (
  <footer className="py-12 border-t border-border bg-card">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-bold gradient-text">CollabSphere</div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 CollabSphere. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
