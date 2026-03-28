import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">{t("footer.brand")}</h3>
                        <p className="text-muted-foreground text-sm">
                            {t("footer.brandDesc")}
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/ashsajal1/react-saas-template"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FaGithub size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("nav.home")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/slides" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t("nav.slides")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.legal")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-muted-foreground text-sm">
                                    {t("footer.privacy")}
                                </span>
                            </li>
                            <li>
                                <span className="text-muted-foreground text-sm">
                                    {t("footer.terms")}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t">
                    <p className="text-center text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} {t("footer.brand")}। {t("footer.copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
