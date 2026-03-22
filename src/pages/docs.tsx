import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import { useTranslation } from "react-i18next";
import { 
    Book, 
    Search,
    ChevronRight,
    Code,
    Settings,
    Users,
    Database,
    Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const sidebarItems = [
    {
        titleKey: "docs.gettingStarted",
        items: [
            { labelKey: "docs.introduction", href: "#" },
            { labelKey: "docs.quickStart", href: "#" },
            { labelKey: "docs.installation", href: "#" },
            { labelKey: "docs.configuration", href: "#" }
        ]
    },
    {
        titleKey: "docs.coreConcepts",
        items: [
            { labelKey: "docs.authentication", href: "#" },
            { labelKey: "docs.authorization", href: "#" },
            { labelKey: "docs.dataModels", href: "#" },
            { labelKey: "docs.apiReference", href: "#" }
        ]
    },
    {
        titleKey: "docs.features_label",
        items: [
            { labelKey: "docs.userManagement", href: "#" },
            { labelKey: "docs.teamCollab", href: "#" },
            { labelKey: "docs.analytics_label", href: "#" },
            { labelKey: "docs.integrations", href: "#" }
        ]
    },
    {
        titleKey: "docs.advanced",
        items: [
            { labelKey: "docs.customization", href: "#" },
            { labelKey: "docs.performance", href: "#" },
            { labelKey: "docs.security_label", href: "#" },
            { labelKey: "docs.deployment", href: "#" }
        ]
    }
];

const quickLinks = [
    {
        titleKey: "docs.apiRefTitle",
        descKey: "docs.apiRefDesc",
        icon: <Code className="h-6 w-6" />
    },
    {
        titleKey: "docs.userGuideTitle",
        descKey: "docs.userGuideDesc",
        icon: <Book className="h-6 w-6" />
    },
    {
        titleKey: "docs.configTitle",
        descKey: "docs.configDesc",
        icon: <Settings className="h-6 w-6" />
    },
    {
        titleKey: "docs.teamMgmtTitle",
        descKey: "docs.teamMgmtDesc",
        icon: <Users className="h-6 w-6" />
    },
    {
        titleKey: "docs.databaseTitle",
        descKey: "docs.databaseDesc",
        icon: <Database className="h-6 w-6" />
    },
    {
        titleKey: "docs.securityTitle",
        descKey: "docs.securityDesc",
        icon: <Shield className="h-6 w-6" />
    }
];

export default function Docs() {
    const { t } = useTranslation();

    return (
        <>
            <Seo 
                title={t("docs.title")} 
                description={t("docs.description")} 
            />
            
            <div className="min-h-screen bg-background">
                {/* Header */}
                <section className="pt-20 pb-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Text 
                                    label={t("docs.headline")} 
                                    className="text-4xl md:text-5xl font-bold text-primary mb-6" 
                                />
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {t("docs.subheadline")}
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    {t("docs.description")}
                                </p>
                                <div className="relative max-w-2xl mx-auto">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder={t("docs.searchPlaceholder")}
                                        className="pl-12 py-6 text-lg"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Quick Links */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-6">
                                {quickLinks.map((link, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="text-primary p-2 bg-primary/10 rounded-lg">
                                                {link.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                                    {t(link.titleKey)}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {t(link.descKey)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Documentation Layout */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-4 gap-8">
                                {/* Sidebar */}
                                <div className="md:col-span-1">
                                    <div className="sticky top-8">
                                        <nav className="space-y-8">
                                            {sidebarItems.map((section, index) => (
                                                <div key={index}>
                                                    <h3 className="font-semibold text-foreground mb-3">
                                                        {t(section.titleKey)}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {section.items.map((item, itemIndex) => (
                                                            <li key={itemIndex}>
                                                                <a
                                                                    href={item.href}
                                                                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    <ChevronRight className="h-4 w-4" />
                                                                    {t(item.labelKey)}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </nav>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="md:col-span-3">
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <h2>{t("docs.gettingStartedTitle")}</h2>
                                        <p>
                                            {t("docs.gettingStartedWelcome")}
                                        </p>

                                        <h3>{t("docs.installation")}</h3>
                                        <p>
                                            {t("docs.gettingStartedSteps")}
                                        </p>
                                        <ol>
                                            <li>{t("docs.step1")}</li>
                                            <li>{t("docs.step2")}</li>
                                            <li>{t("docs.step3")}</li>
                                            <li>{t("docs.step4")}</li>
                                        </ol>

                                        <h3>{t("docs.quickStartTitle")}</h3>
                                        <p>
                                            {t("docs.quickStartOverview")}
                                        </p>
                                        <ul>
                                            <li>{t("docs.feature1")}</li>
                                            <li>{t("docs.feature2")}</li>
                                            <li>{t("docs.feature3")}</li>
                                            <li>{t("docs.feature4")}</li>
                                        </ul>

                                        <div className="bg-muted p-4 rounded-lg my-6">
                                            <h4 className="text-lg font-semibold mb-2">{t("docs.proTip")}</h4>
                                            <p className="mb-0">
                                                {t("docs.proTipContent")}
                                            </p>
                                        </div>

                                        <h3>{t("docs.nextStepsTitle")}</h3>
                                        <p>
                                            {t("docs.nextStepsDesc")}
                                        </p>
                                        <ul>
                                            <li>{t("docs.nextStep1")}</li>
                                            <li>{t("docs.nextStep2")}</li>
                                            <li>{t("docs.nextStep3")}</li>
                                            <li>{t("docs.nextStep4")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                {t("docs.ctaHeadline")}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                {t("docs.ctaSubheadline")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-primary hover:bg-primary/90">
                                    {t("docs.contactSupport")}
                                </Button>
                                <Button variant="outline">
                                    {t("docs.joinCommunity")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
