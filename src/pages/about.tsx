import Seo from '../components/Seo';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import Text from "@/components/custom-ui/text";
import { useTranslation } from "react-i18next";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";

const values = [
  {
    icon: <Target className="w-6 h-6" />,
    titleKey: "common.ourMission",
    descKey: "common.missionDesc"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    titleKey: "common.innovation",
    descKey: "common.innovationDesc"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    titleKey: "common.trustSecurity",
    descKey: "common.trustSecurityDesc"
  }
];

const team = [
  {
    name: "সারা আক্তার",
    role: "সিইও ও প্রতিষ্ঠাতা",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "মিশকাত হোসেন",
    role: "সিটিও",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "তানিয়া করিম",
    role: "প্রোডাক্ট প্রধান",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo 
        title={t("common.aboutTitle")} 
        description={t("common.aboutDesc")} 
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Text 
                  label={t("common.aboutHeadline")} 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6" 
                />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t("common.aboutSubheadline")}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t("common.aboutDesc")}
                </p>
                <Button 
                  size="lg"
                  className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("common.joinUs")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-primary mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(value.descKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("common.teamSection")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("common.teamSubheadline")}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center bg-card p-8 rounded-2xl shadow-sm"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("common.startToday")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t("common.startTodayDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground"
                >
                  <span className="relative z-10">{t("common.start")}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="relative overflow-hidden group bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary hover:shadow-lg transition-all duration-300 text-secondary-foreground"
                >
                  <span className="relative z-10">{t("common.contactBtn")}</span>
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
