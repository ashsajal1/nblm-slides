import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import { useTranslation } from "react-i18next";
import { Check, Sparkles } from "lucide-react";

const plans = [
    {
        nameKey: "pricing.starter",
        price: "29",
        descKey: "pricing.starterDesc",
        featuresKey: [
            "pricing.starterFeature1",
            "pricing.starterFeature2",
            "pricing.starterFeature3",
            "pricing.starterFeature4",
            "pricing.starterFeature5",
            "pricing.starterFeature6"
        ],
        popular: false
    },
    {
        nameKey: "pricing.professional",
        price: "79",
        descKey: "pricing.professionalDesc",
        featuresKey: [
            "pricing.professionalFeature1",
            "pricing.professionalFeature2",
            "pricing.professionalFeature3",
            "pricing.professionalFeature4",
            "pricing.professionalFeature5",
            "pricing.professionalFeature6",
            "pricing.professionalFeature7",
            "pricing.professionalFeature8"
        ],
        popular: true
    },
    {
        nameKey: "pricing.enterprise",
        price: "299",
        descKey: "pricing.enterpriseDesc",
        featuresKey: [
            "pricing.enterpriseFeature1",
            "pricing.enterpriseFeature2",
            "pricing.enterpriseFeature3",
            "pricing.enterpriseFeature4",
            "pricing.enterpriseFeature5",
            "pricing.enterpriseFeature6",
            "pricing.enterpriseFeature7",
            "pricing.enterpriseFeature8",
            "pricing.enterpriseFeature9"
        ],
        popular: false
    }
];

export default function Pricing() {
    const { t } = useTranslation();

    return (
        <>
            <Seo 
                title={t("pricing.title")} 
                description={t("pricing.description")} 
            />
            
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
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
                                    label={t("pricing.headline")} 
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6" 
                                />
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {t("pricing.subheadline")}
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {t("pricing.description")}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative group ${
                                        plan.popular 
                                            ? 'md:-mt-4 md:mb-4' 
                                            : ''
                                    }`}
                                >
                                    <div className={`bg-card rounded-2xl shadow-lg p-8 relative transition-all duration-300 hover:shadow-xl ${
                                        plan.popular 
                                            ? 'border-2 border-primary bg-gradient-to-b from-card to-card/95' 
                                            : 'border border-border hover:border-primary/50'
                                    }`}>
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                                                    <Sparkles className="w-4 h-4" />
                                                    {t("pricing.mostPopular")}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-foreground mb-2">{t(plan.nameKey)}</h3>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">${plan.price}</span>
                                                <span className="text-muted-foreground">{t("pricing.month")}</span>
                                            </div>
                                            <p className="text-muted-foreground mt-2">{t(plan.descKey)}</p>
                                        </div>

                                        <ul className="space-y-4 mb-8">
                                            {plan.featuresKey.map((featureKey, featureIndex) => (
                                                <motion.li 
                                                    key={featureIndex} 
                                                    className="flex items-start gap-3"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: featureIndex * 0.1 }}
                                                >
                                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                                    <span className="text-muted-foreground">{t(featureKey)}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <Button 
                                            size="lg"
                                            className={`w-full relative overflow-hidden group ${
                                                plan.popular 
                                                    ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 text-primary-foreground' 
                                                    : 'bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary hover:shadow-lg text-secondary-foreground'
                                            } transition-all duration-300`}
                                        >
                                            <span className="relative z-10">{t("pricing.getStarted")}</span>
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold text-foreground text-center mb-12"
                            >
                                {t("pricing.faqTitle")}
                            </motion.h2>
                            
                            <div className="space-y-8">
                                {[
                                    { qKey: "pricing.faq1Q", aKey: "pricing.faq1A" },
                                    { qKey: "pricing.faq2Q", aKey: "pricing.faq2A" },
                                    { qKey: "pricing.faq3Q", aKey: "pricing.faq3A" },
                                    { qKey: "pricing.faq4Q", aKey: "pricing.faq4A" }
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {t(faq.qKey)}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {t(faq.aKey)}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                {t("pricing.ctaHeadline")}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                {t("pricing.ctaSubheadline")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                    size="lg"
                                    className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground"
                                >
                                    <span className="relative z-10">{t("pricing.contactSales")}</span>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Button>
                                <Button 
                                    size="lg"
                                    variant="secondary"
                                    className="relative overflow-hidden group bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary hover:shadow-lg transition-all duration-300 text-secondary-foreground"
                                >
                                    <span className="relative z-10">{t("pricing.viewDocs")}</span>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
