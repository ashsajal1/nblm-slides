import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import { useTranslation } from "react-i18next";
import { 
    Zap, 
    Shield, 
    BarChart3, 
    Users, 
    Clock, 
    Settings,
    MessageSquare,
    FileText,
    Globe,
    Lock
} from "lucide-react";

const features = [
    {
        category: "Performance",
        items: [
            {
                titleKey: "features.lightningFast",
                descKey: "features.lightningFastDesc",
                icon: <Zap className="h-6 w-6" />
            },
            {
                titleKey: "features.realtime",
                descKey: "features.realtimeDesc",
                icon: <Clock className="h-6 w-6" />
            }
        ]
    },
    {
        category: "Security",
        items: [
            {
                titleKey: "features.enterpriseSecurity",
                descKey: "features.enterpriseSecurityDesc",
                icon: <Shield className="h-6 w-6" />
            },
            {
                titleKey: "features.dataProtection",
                descKey: "features.dataProtectionDesc",
                icon: <Lock className="h-6 w-6" />
            }
        ]
    },
    {
        category: "Analytics",
        items: [
            {
                titleKey: "features.advancedAnalytics",
                descKey: "features.advancedAnalyticsDesc",
                icon: <BarChart3 className="h-6 w-6" />
            },
            {
                titleKey: "features.customReports",
                descKey: "features.customReportsDesc",
                icon: <FileText className="h-6 w-6" />
            }
        ]
    },
    {
        category: "Collaboration",
        items: [
            {
                titleKey: "features.teamCollab",
                descKey: "features.teamCollabDesc",
                icon: <Users className="h-6 w-6" />
            },
            {
                titleKey: "features.communication",
                descKey: "features.communicationDesc",
                icon: <MessageSquare className="h-6 w-6" />
            }
        ]
    },
    {
        category: "Integration",
        items: [
            {
                titleKey: "features.easyIntegration",
                descKey: "features.easyIntegrationDesc",
                icon: <Settings className="h-6 w-6" />
            },
            {
                titleKey: "features.globalAccess",
                descKey: "features.globalAccessDesc",
                icon: <Globe className="h-6 w-6" />
            }
        ]
    }
];

export default function Features() {
    const { t } = useTranslation();

    return (
        <>
            <Seo 
                title={t("features.title")} 
                description={t("features.description")} 
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
                                    label={t("features.headline")} 
                                    className="text-4xl md:text-5xl font-bold text-primary mb-6" 
                                />
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {t("features.subheadline")}
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {t("features.description")}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            {features.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="mb-16">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-2xl font-bold text-foreground mb-8"
                                    >
                                        {t(category.category === "Performance" ? "features.performance" : 
                                          category.category === "Security" ? "features.security" : 
                                          category.category === "Analytics" ? "features.analytics" : 
                                          category.category === "Collaboration" ? "features.collaboration" : 
                                          "features.integration")}
                                    </motion.h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {category.items.map((feature, featureIndex) => (
                                            <motion.div
                                                key={featureIndex}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                                                className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="text-primary p-2 bg-primary/10 rounded-lg">
                                                        {feature.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                                            {t(feature.titleKey)}
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            {t(feature.descKey)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                {t("features.ctaHeadline")}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                {t("features.ctaSubheadline")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    {t("features.startTrial")}
                                </Button>
                                <Button size="lg" variant="outline">
                                    {t("features.scheduleDemo")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
