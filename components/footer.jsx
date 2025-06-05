import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Industry Insights", href: "/dashboard" },
      { name: "Resume Builder", href: "/resume" },
      { name: "Cover Letter", href: "/ai-cover-letter" },
      { name: "Interview Prep", href: "/interview" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/docs" },
      { name: "FAQs", href: "/faqs" },
      { name: "Support", href: "/support" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      {
        name: "GitHub",
        href: "https://github.com/yourusername",
        icon: Github,
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/in/yourusername",
        icon: Linkedin,
      },
      {
        name: "Twitter",
        href: "https://twitter.com/yourusername",
        icon: Twitter,
      },
      {
        name: "YouTube",
        href: "https://youtube.com/@roadsidecoder",
        icon: Youtube,
      },
    ],
  };

  return (
    <footer className="border-t bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="AI Career Coach Logo"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Empowering your career journey with AI-powered tools and
              personalized guidance for professional success.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} AI Career Coach. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
