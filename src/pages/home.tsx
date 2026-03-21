import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Seo from '../components/Seo';
import Particles from "@/components/custom-ui/particles";
import { ChevronLeft, ChevronRight, HelpCircle, Lightbulb } from "lucide-react";

const slides = [
    { question: "মানবদেহের রোগ প্রতিরোধ ক্ষমতা বা সিস্টেমকে এক কথায় কী বলা হয়?", answer: "ইমিউনিটি (Immunity) বা প্রতিরক্ষা।" },
    { question: "জীববিজ্ঞানের যে শাখায় মানবদেহের প্রতিরক্ষা ব্যবস্থা নিয়ে আলোচনা করা হয় তাকে কী বলে?", answer: "ইমিউনোলজি (Immunology)।" },
    { question: "মানবদেহের প্রতিরক্ষা ব্যবস্থার প্রধান কয়টি স্তর রয়েছে?", answer: "৩টি (প্রথম, দ্বিতীয় ও তৃতীয় স্তর)।" },
    { question: "দেহের 'প্রথম প্রতিরক্ষা স্তর' কী ধরণের প্রতিরক্ষা ব্যবস্থা হিসেবে পরিচিত?", answer: "নন-স্পেসিফিক বা অবিশেষিক প্রতিরক্ষা ব্যবস্থা।" },
    { question: "মানুষের শরীরের সবচেয়ে বড় অঙ্গ কোনটি যা প্রথম প্রতিরক্ষা স্তর হিসেবে কাজ করে?", answer: "ত্বক (Skin)।" },
    { question: "ত্বকের উপরিভাগের pH মান সাধারণত কত থাকে যা জীবাণু নাশক হিসেবে কাজ করে?", answer: "pH মান ৩.০ থেকে ৫.০ এর মধ্যে থাকে।" },
    { question: "লালা ও অশ্রুতে বিদ্যমান কোন এনজাইম ব্যাকটেরিয়ার কোষপ্রাচীর ধ্বংস করতে পারে?", answer: "লাইসোজাইম (Lysozyme) এনজাইম।" },
    { question: "পাকস্থলীর প্রাচীর থেকে নিঃসৃত কোন এসিড খাদ্যের সাথে আসা জীবাণু ধ্বংস করে?", answer: "HCl (হাইড্রোক্লোরিক এসিড)।" },
    { question: "শ্বাসনালীতে ধূলিকণা ও জীবাণু আটকে রাখার জন্য ব্যবহৃত সূক্ষ্ম রোম সদৃশ অঙ্গাণু কোনটি?", answer: "সিলিয়া (Cilia)।" },
    { question: "কানের বহিকর্ণে উৎপন্ন কোন মোমজাতীয় পদার্থ রোগজীবাণুকে আটকে ফেলে?", answer: "সেরুমেন (Cerumen)।" },
    { question: "কোন প্রক্রিয়ায় শ্বেত রক্তকণিকা সরাসরি অণুজীবকে ভক্ষণ করে ধ্বংস করে ফেলে?", answer: "ফ্যাগোসাইটোসিস (Phagocytosis)।" },
    { question: "১৮৮৪ সালে কোন বিজ্ঞানী প্রথম ফ্যাগোসাইটোসিস প্রক্রিয়া আবিষ্কার করেন?", answer: "রুশ বিজ্ঞানী ইলিয়া মেচনিকফ (Ilya Mechnikov)।" },
    { question: "রাসায়নিক সংকেতের প্রতি সাড়া দিয়ে ফ্যাগোসাইট কোষের রোগজীবাণুর দিকে অগ্রসর হওয়াকে কী বলে?", answer: "কেমোট্যাক্সিস (Chemotaxis)।" },
    { question: "মানবদেহের দ্বিতীয় প্রতিরক্ষা স্তরের একটি প্রধান উপাদানের নাম লেখ যা রক্তকণিকা দ্বারা গঠিত।", answer: "ফ্যাগোসাইট (যেমন- ম্যাক্রোফেজ ও নিউট্রোফিল)।" },
    { question: "ভাইরাস আক্রান্ত কোষ থেকে নিঃসৃত হয় এমন এক ধরণের ক্ষুদ্র গ্লাইকোপ্রোটিন কোনটি?", answer: "ইন্টারফেরন (Interferon)।" },
    { question: "দেহে অণুজীবের আক্রমণের ফলে সৃষ্ট প্রদাহের (Inflammation) একটি প্রধান লক্ষণ কী?", answer: "ক্ষতস্থান লাল হওয়া, ফুলে যাওয়া ও তাপমাত্রা বৃদ্ধি।" },
    { question: "শরীরে জ্বর সৃষ্টির জন্য দায়ী বিশেষ রাসায়নিক পদার্থের নাম কী?", answer: "পাইরোজেন (Pyrogen)।" },
    { question: "কমপ্লিমেন্ট সিস্টেম (Complement System) কত ধরণের প্লাজমা প্রোটিন নিয়ে গঠিত?", answer: "প্রায় ২০ ধরণের প্লাজমা প্রোটিন।" },
    { question: "যকৃতে অবস্থিত বিশেষ ধরণের ম্যাক্রোফেজ কোষকে কী বলা হয়?", answer: "কুফার কোষ (Kupffer Cell)।" },
    { question: "ফুসফুসে অবস্থিত ম্যাক্রোফেজ কোষগুলো কী নামে পরিচিত?", answer: "অ্যালভিওলার ম্যাক্রোফেজ।" },
    { question: "মনোসাইট রক্ত থেকে টিস্যুতে প্রবেশ করে আকারে বড় হলে তাকে কী বলে?", answer: "ম্যাক্রোফেজ।" },
    { question: "দেহে বহিরাগত কোনো বস্তু বা অণুজীব প্রবেশ করলে তার বিরুদ্ধে যে প্রোটিন উৎপন্ন হয় তাকে কী বলে?", answer: "অ্যান্টিবডি (Antibody)।" },
    { question: "অ্যান্টিবডি উৎপাদনকারী প্রধান কোষ কোনটি?", answer: "B-লিম্ফোসাইট (বি-কোষ)।" },
    { question: "অ্যান্টিজেনের যে নির্দিষ্ট অংশের সাথে অ্যান্টিবডি যুক্ত হয় তাকে কী বলে?", answer: "এপিটোপ (Epitope)।" },
    { question: "অ্যান্টিবডির যে অংশটি অ্যান্টিজেনের এপিটোপের সাথে যুক্ত হয় তাকে কী বলে?", answer: "প্যারাটোপ (Paratope)।" },
    { question: "একটি অ্যান্টিবডি অণুর গাঠনিক আকৃতি ইংরেজি কোন অক্ষরের মতো?", answer: "ইংরেজি 'Y' অক্ষরের মতো।" },
    { question: "একটি অ্যান্টিবডিতে কয়টি ভারী (Heavy) এবং কয়টি হালকা (Light) পলিপেপটাইড শৃঙ্খল থাকে?", answer: "২টি ভারী শৃঙ্খল এবং ২টি হালকা শৃঙ্খল।" },
    { question: "অ্যান্টিবডির শৃঙ্খলগুলো একে অপরের সাথে কোন ধরণের রাসায়নিক বন্ধনী দ্বারা যুক্ত থাকে?", answer: "ডাই-সালফাইড বন্ধনী (-S-S- bond)।" },
    { question: "মানবদেহে কয় ধরণের ইমিউনোগ্লোবিউলিন (অ্যান্টিবডি) পাওয়া যায়?", answer: "৫ ধরণের (IgG, IgA, IgM, IgE, IgD)।" },
    { question: "রক্তের সিরামে কোন ধরণের অ্যান্টিবডির পরিমাণ সবচেয়ে বেশি (প্রায় ৭৫%)?", answer: "IgG।" },
    { question: "কোন ধরণের অ্যান্টিবডি অমরা বা প্লাসেন্টা অতিক্রম করে মাতৃদেহ থেকে ভ্রূণে প্রবেশ করতে পারে?", answer: "IgG।" },
    { question: "মায়ের বুকের দুধে বা শালদুধে (Colostrum) কোন ধরণের অ্যান্টিবডি প্রচুর পরিমাণে থাকে?", answer: "IgA।" },
    { question: "শরীরে অ্যালার্জি প্রতিক্রিয়ার সময় কোন অ্যান্টিবডির মাত্রা বেড়ে যায়?", answer: "IgE।" },
    { question: "অণুজীব আক্রমণের পর রক্তে সবার প্রথম কোন অ্যান্টিবডিটি উৎপন্ন হয়?", answer: "IgM।" },
    { question: "অ্যান্টিবডি অণুর শৃঙ্খলগুলোর যে অংশটি স্থির থাকে তাকে কী বলে?", answer: "স্থায়ী অঞ্চল বা Constant Region।" },
    { question: "অ্যান্টিবডি অণুর যে অংশটি বিভিন্ন অ্যান্টিজেনের প্রকৃতির উপর ভিত্তি করে পরিবর্তিত হয় তাকে কী বলে?", answer: "পরিবর্তনশীল অঞ্চল বা Variable Region।" },
    { question: "যে প্রতিরক্ষা ব্যবস্থা জন্মের সময় থেকেই বংশগতভাবে অর্জিত হয় তাকে কী বলে?", answer: "সহজাত প্রতিরক্ষা (Innate Immunity)।" },
    { question: "কোনো নির্দিষ্ট রোগজীবাণুর বিরুদ্ধে যে প্রতিরক্ষা ব্যবস্থা জীবনকালে গড়ে ওঠে তাকে কী বলে?", answer: "অর্জিত প্রতিরক্ষা (Acquired Immunity)।" },
    { question: "ভ্যাকসিন বা টিকার মাধ্যমে যে ইমিউনিটি অর্জন করা হয় তা কোন ধরণের?", answer: "কৃত্রিম সক্রিয় অর্জিত প্রতিরক্ষা।" },
    { question: "অসুস্থ ব্যক্তির রক্ত থেকে সিরাম সংগ্রহ করে অন্য দেহে প্রবেশ করালে তাকে কী ধরণের প্রতিরক্ষা বলে?", answer: "কৃত্রিম নিষ্ক্রিয় অর্জিত প্রতিরক্ষা।" },
    { question: "স্মৃতি কোষ বা মেমোরি কোষের (Memory Cell) প্রধান কাজ কী?", answer: "একই জীবাণু পুনরায় আক্রমণ করলে দ্রুত ও শক্তিশালী সাড়া প্রদান করা।" },
    { question: "অ্যান্টিবডি ও অ্যান্টিজেনের বিক্রিয়ার ফলে অণুজীবগুলো দলবদ্ধ হওয়ার প্রক্রিয়াকে কী বলে?", answer: "অ্যাগ্লুটিনেশন (Agglutination)।" },
    { question: "ওপসোনাইজেশন (Opsonization) বলতে কী বোঝায়?", answer: "জীবাণুর গায়ে প্রোটিন আবরণ তৈরির মাধ্যমে তাকে ফ্যাগোসাইটের কাছে সহজলভ্য করার প্রক্রিয়া।" },
    { question: "যক্ষ্মা প্রতিরোধে কোন টিকা ব্যবহার করা হয়?", answer: "BCG টিকা।" },
    { question: "BCG এর পূর্ণরূপ কী?", answer: "Bacillus Calmette Guerin।" },
    { question: "টিকা বা ভ্যাকসিনের উদ্ভাবক হিসেবে কাকে গণ্য করা হয় এবং কত সালে?", answer: "এডওয়ার্ড জেনার, ১৭৯৬ সালে।" },
    { question: "কোন কোষটি প্রধানত ভাইরাস আক্রান্ত কোষ বা টিউমার কোষকে ধ্বংস করতে পারে?", answer: "NK কোষ (Natural Killer Cell)।" },
    { question: "রক্তের বেসোফিল কোষ থেকে নিঃসৃত কোন পদার্থ রক্তনালীর প্রসারণ ঘটায় এবং প্রদাহ সৃষ্টি করে?", answer: "হিস্টামিন (Histamine)।" },
    { question: "মানুষের লালাগ্রন্থি থেকে নিঃসৃত কোন এনজাইম ব্যাকটেরিয়া নাশক হিসেবে কাজ করে?", answer: "লাইসোজাইম।" },
    { question: "ফ্যাগোসাইটিক ভ্যাসিকল এবং লাইসোজোম একত্রিত হয়ে যে গহ্বর তৈরি করে তাকে কী বলে?", answer: "ফ্যাগোলাইসোজোম।" },
    { question: "ম্যাক্রোফেজ সাধারণত কতদিন পর্যন্ত টিস্যুতে জীবিত থাকতে পারে?", answer: "কয়েক মাস থেকে কয়েক বছর।" },
    { question: "নিউট্রোফিল সাধারণত কতদিন রক্ত প্রবাহে অবস্থান করে?", answer: "২ থেকে ৫ দিন।" },
    { question: "অ্যান্টিবডি অণুর কব্জা অঞ্চল বা Hinge Region এর কাজ কী?", answer: "অ্যান্টিবডি বাহুদ্বয়কে নমনীয়তা দান করা যাতে অ্যান্টিজেনের সাথে সহজে যুক্ত হতে পারে।" },
    { question: "কোন ধরণের ইমিউনোগ্লোবিউলিন সবচেয়ে বড় আকারের এবং পাঁচটি ইউনিটের সমন্বয়ে গঠিত (Pentamer)?", answer: "IgM।" },
    { question: "রক্তের প্লাজমা থেকে ফাইব্রিনোজেন পৃথক করলে যে হালকা হলুদ রঙের তরল অবশিষ্ট থাকে তাকে কী বলে?", answer: "সিরাম (Serum)।" },
    { question: "একটি অ্যান্টিবডিতে কয়টি অ্যান্টিজেন বাইন্ডিং সাইট থাকে?", answer: "২টি।" },
    { question: "নিচের কোন কোষটি অদানাদার শ্বেত রক্তকণিকা থেকে সৃষ্টি হয় এবং প্রতিরক্ষায় অংশ নেয়?", answer: "মনোসাইট ও লিম্ফোসাইট।" },
    { question: "অ্যান্টিবডি অণুর প্রতিটি হালকা শৃঙ্খলে অ্যামিনো এসিডের সংখ্যা প্রায় কত?", answer: "প্রায় ২২০টি।" },
    { question: "অ্যান্টিবডি অণুর প্রতিটি ভারী শৃঙ্খলে অ্যামিনো এসিডের সংখ্যা কত হতে পারে?", answer: "৪৪০ থেকে ৫৫০টি।" },
    { question: "শরীরের ক্ষতস্থানে পুঁজ (Pus) জমার প্রধান কারণ কী?", answer: "মৃত ব্যাকটেরিয়া এবং শ্বেত রক্তকণিকা (বিশেষ করে নিউট্রোফিল) জমা হওয়া।" },
    { question: "অ্যান্টিজেনের বিপরীতে শরীরে ইমিউন সাড়া প্রদানের ক্ষমতাকে কী বলে?", answer: "ইমিউনোজেনেসিটি (Immunogenicity)।" },
    { question: "মানুষের পাকস্থলীর প্যারাইটাল কোষ থেকে নিঃসৃত হয় কোনটি?", answer: "HCl।" },
    { question: "সিলিয়া কোন ধরণের প্রতিরক্ষা স্তরের অন্তর্ভুক্ত?", answer: "প্রথম প্রতিরক্ষা স্তর।" },
    { question: "জ্বর হলে শরীরের তাপমাত্রা বৃদ্ধির প্রধান সুবিধা কী?", answer: "অণুজীবের বংশবৃদ্ধি ব্যাহত করা এবং প্রতিরক্ষা কোষের কার্যকারিতা বাড়ানো।" },
    { question: "কোন ধরণের শ্বেত রক্তকণিকা হেপারিন ও হিস্টামিন নিঃসরণ করে?", answer: "বেসোফিল।" },
    { question: "অ্যান্টিবডি মূলত কী ধরণের রাসায়নিক পদার্থ?", answer: "গ্লাইকোপ্রোটিন (Glycoprotein)।" },
    { question: "একটি অ্যান্টিবডিতে হালকা ও ভারী শৃঙ্খলের অনুপাত কত?", answer: "১ : ১ (প্রতিটি হালকা শৃঙ্খলের বিপরীতে একটি ভারী শৃঙ্খল)।" },
    { question: "কোন বিজ্ঞানী প্রথম 'অ্যান্টিবডি' শব্দটি ব্যবহার করেন?", answer: "জার্মান বিজ্ঞানী পল এরলিখ (Paul Ehrlich)।" },
    { question: "অ্যান্টিজেনের গঠনগত একককে কী বলা হয়?", answer: "অ্যান্টিজেনিক ডিটারমিনেন্ট বা এপিটোপ।" },
    { question: "অ্যান্টিবডি অণুর হালকা শৃঙ্খলে কয়টি ডোমেইন থাকে?", answer: "২টি (একটি স্থায়ী ও একটি পরিবর্তনশীল)।" },
    { question: "দেহের স্বাভাবিক অণুজীব বা মাইক্রোবায়োটা কীভাবে সুরক্ষা দেয়?", answer: "ক্ষতিকর ব্যাকটেরিয়ার সাথে পুষ্টি ও স্থানের প্রতিযোগিতা করে তাদের বংশবৃদ্ধি রোধ করে।" },
    { question: "মনোসাইট ও ম্যাক্রোফেজ এর মধ্যে প্রধান পার্থক্য কী?", answer: "মনোসাইট রক্তে থাকে, আর ম্যাক্রোফেজ টিস্যুতে অবস্থান করে।" },
    { question: "অর্জিত প্রতিরক্ষা ব্যবস্থা মূলত কয় ধরণের সাড়া প্রদান করে?", answer: "২ ধরণের (প্রাথমিক ও গৌণ বা মেমোরি ভিত্তিক সাড়া)।" },
    { question: "স্মলপক্স বা গুটিবসন্তের টিকা কে আবিষ্কার করেন?", answer: "এডওয়ার্ড জেনার।" },
    { question: "অ্যান্টিবডির মূল কাঠামোটি কয়টি পলিপেপটাইড শৃঙ্খল নিয়ে গঠিত?", answer: "৪টি শৃঙ্খল।" },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 400 : -400,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 400 : -400,
        opacity: 0,
    }),
};

export default function Home() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const paginate = useCallback((newDirection: number) => {
        setShowAnswer(false);
        setDirection(newDirection);
        setCurrent((prev) => {
            const next = prev + newDirection;
            if (next < 0) return slides.length - 1;
            if (next >= slides.length) return 0;
            return next;
        });
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setShowAnswer((s) => !s);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [paginate]);

    useEffect(() => {
        setShowAnswer(false);
    }, [current]);

    const progress = ((current + 1) / slides.length) * 100;

    return (
        <>
            <Seo
                title="প্রতিরক্ষা ফ্ল্যাশকার্ড"
                description="ইমিউনোলজি — ৭৫টি প্রশ্ন ও উত্তর"
            />

            <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background">
                <div className="absolute inset-0">
                    <Particles />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            প্রতিরক্ষা ফ্ল্যাশকার্ড
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            স্লাইড {current + 1} / {slides.length}
                        </p>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Slide */}
                    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-lg min-h-[340px] flex items-center justify-center p-8">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full text-center space-y-8"
                            >
                                {/* Question */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <HelpCircle className="h-6 w-6" />
                                        <span className="text-sm font-semibold uppercase tracking-wider">
                                            প্রশ্ন
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                                        {slides[current].question}
                                    </h2>
                                </div>

                                {/* Answer toggle */}
                                {!showAnswer ? (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => setShowAnswer(true)}
                                        className="text-base"
                                    >
                                        <Lightbulb className="mr-2 h-5 w-5" />
                                        উত্তর দেখুন
                                    </Button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-primary/10 border border-primary/20 rounded-xl p-6 mx-auto max-w-lg"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-primary mb-2">
                                            <Lightbulb className="h-5 w-5" />
                                            <span className="text-sm font-semibold uppercase tracking-wider">
                                                উত্তর
                                            </span>
                                        </div>
                                        <p className="text-lg md:text-xl font-semibold text-foreground">
                                            {slides[current].answer}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => paginate(-1)}
                            className="h-12 w-12 rounded-full"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        {/* Dots — show max 10 with center focus */}
                        <div className="flex gap-1.5 max-w-[280px] overflow-hidden items-center">
                            {slides.map((_, i) => {
                                const dist = Math.abs(i - current);
                                if (dist > 4 && i !== 0 && i !== slides.length - 1) return null;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > current ? 1 : -1);
                                            setCurrent(i);
                                        }}
                                        className={`h-2.5 w-2.5 rounded-full transition-all shrink-0 ${
                                            i === current
                                                ? "bg-primary scale-125"
                                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                        }`}
                                    />
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => paginate(1)}
                            className="h-12 w-12 rounded-full"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Keyboard hint */}
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        ← → দিয়ে স্লাইড পরিবর্তন, Space দিয়ে উত্তর দেখুন
                    </p>
                </div>
            </section>
        </>
    );
}
