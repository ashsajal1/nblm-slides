import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import { useTranslation } from "react-i18next";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock,
    Send
} from "lucide-react";

const contactInfo = [
    {
        icon: <Mail className="h-6 w-6" />,
        titleKey: "contact.emailInfo",
        content: "support@saasify.com",
        descKey: "contact.emailInfoDesc"
    },
    {
        icon: <Phone className="h-6 w-6" />,
        titleKey: "contact.phone",
        content: "+1 (555) 123-4567",
        descKey: "contact.phoneDesc"
    },
    {
        icon: <MapPin className="h-6 w-6" />,
        titleKey: "contact.office",
        content: "123 Business Ave, Suite 100",
        descKey: "contact.officeDesc"
    },
    {
        icon: <Clock className="h-6 w-6" />,
        titleKey: "contact.hours",
        content: "Monday - Friday",
        descKey: "contact.hoursDesc"
    }
];

export default function Contact() {
    const { t } = useTranslation();

    return (
        <>
            <Seo 
                title={t("contact.title")} 
                description={t("contact.description")} 
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
                                    label={t("contact.headline")} 
                                    className="text-4xl md:text-5xl font-bold text-primary mb-6" 
                                />
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {t("contact.subheadline")}
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {t("contact.description")}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Contact Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Contact Form */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-card p-8 rounded-lg shadow-sm"
                                >
                                    <h2 className="text-2xl font-bold text-foreground mb-6">
                                        {t("contact.sendMessage")}
                                    </h2>
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                                                    {t("contact.firstName")}
                                                </label>
                                                <Input 
                                                    id="firstName" 
                                                    placeholder={t("contact.firstNamePlaceholder")} 
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                                                    {t("contact.lastName")}
                                                </label>
                                                <Input 
                                                    id="lastName" 
                                                    placeholder={t("contact.lastNamePlaceholder")} 
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                                {t("contact.email")}
                                            </label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder={t("contact.emailPlaceholder")} 
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                                                {t("contact.subject")}
                                            </label>
                                            <Input 
                                                id="subject" 
                                                placeholder={t("contact.subjectPlaceholder")} 
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                                                {t("contact.message")}
                                            </label>
                                            <Textarea 
                                                id="message" 
                                                placeholder={t("contact.messagePlaceholder")} 
                                                className="w-full min-h-[150px]"
                                            />
                                        </div>
                                        <Button className="w-full bg-primary hover:bg-primary/90">
                                            {t("contact.sendMsg")}
                                            <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </motion.div>

                                {/* Contact Information */}
                                <div className="space-y-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-card p-8 rounded-lg shadow-sm"
                                    >
                                        <h2 className="text-2xl font-bold text-foreground mb-6">
                                            {t("contact.contactInfo")}
                                        </h2>
                                        <div className="space-y-6">
                                            {contactInfo.map((info, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="text-primary p-2 bg-primary/10 rounded-lg">
                                                        {info.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">
                                                            {t(info.titleKey)}
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            {info.content}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t(info.descKey)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Map or Additional Info */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="bg-card p-8 rounded-lg shadow-sm"
                                    >
                                        <h2 className="text-2xl font-bold text-foreground mb-6">
                                            {t("contact.followUs")}
                                        </h2>
                                        <div className="flex gap-4">
                                            <Button variant="outline" className="flex-1">
                                                {t("contact.twitter")}
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                {t("contact.linkedin")}
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                {t("contact.github")}
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
