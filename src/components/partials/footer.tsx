import { useTranslation } from 'react-i18next';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">{t("footer.brand")}</h3>
                        <p className="text-muted-foreground text-sm">
                            {t("footer.brandDesc")}
                        </p>
                        <div className="flex space-x-4">
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.product")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("nav.features")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("nav.pricing")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.documentation")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.updates")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.company")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.aboutUs")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("nav.blog")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.contact")}
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href="https://careers.example.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    {t("footer.careers")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.legal")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.terms")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/security" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("footer.security")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t">
                    <p className="text-center text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} {t("footer.brand")}। {t("footer.copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
