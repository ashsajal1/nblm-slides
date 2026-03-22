import Seo from '../components/Seo';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import Text from "@/components/custom-ui/text";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";

const values = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "আমাদের লক্ষ্য",
    description: "উদ্ভাবনী সমাধান দিয়ে ব্যবসায়িক প্রবৃদ্ধি ও সাফল্য নিশ্চিত করা।"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "উদ্ভাবন",
    description: "আমরা সর্বদা শিল্পের মান নির্ধারণকারী অত্যাধুনিক সমাধান প্রদান করতে সীমানা ঠেলে যাই।"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "বিশ্বাস ও নিরাপত্তা",
    description: "আপনার ডেটা নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। আমরা সর্বোচ্চ মানের ডেটা সুরক্ষা বজায় রাখি।"
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
  return (
    <>
      <Seo 
        title="আমাদের সম্পর্কে | ফ্ল্যাশকার্ড" 
        description="ফ্ল্যাশকার্ড - আপনার পছন্দের বিষয়ে সহজে অধ্যয়ন করুন।" 
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
                  label="আমাদের সম্পর্কে" 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6" 
                />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  আপনার পছন্দের বিষয়ে শিখুন
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  আমরা একটি দল যারা শিক্ষার্থীদের সহজে ও কার্যকরভাবে শেখাতে সাহায্য করতে নিবেদিত।
                </p>
                <Button 
                  size="lg"
                  className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    আমাদের সাথে যোগ দিন
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
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
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
                আমাদের দলের সাথে পরিচিত হন
              </h2>
              <p className="text-xl text-muted-foreground">
                আমাদের সাফল্যের পেছনে নিবেদিত মানুষরা
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
                আজই শুরু করুন?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                হাজারো শিক্ষার্থী ইতিমধ্যে আমাদের ফ্ল্যাশকার্ড ব্যবহার করছে
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 text-primary-foreground"
                >
                  <span className="relative z-10">শুরু করুন</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="relative overflow-hidden group bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary hover:shadow-lg transition-all duration-300 text-secondary-foreground"
                >
                  <span className="relative z-10">যোগাযোগ করুন</span>
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
