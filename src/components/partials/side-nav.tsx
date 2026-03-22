import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { ModeToggle } from '../mode-toggle';
import Text from '../custom-ui/text';
import { 
    Sparkles, 
    CreditCard, 
    BookOpen, 
    Newspaper, 
    LogIn, 
    UserPlus,
    BarChart3,
    Settings,
    HelpCircle
} from 'lucide-react';

const menuItems = [
    {
        title: "মূল",
        items: [
            { to: "/features", label: "ফিচার", icon: <Sparkles className="w-4 h-4" /> },
            { to: "/pricing", label: "মূল্য", icon: <CreditCard className="w-4 h-4" /> },
            { to: "/docs", label: "ডকুমেন্টেশন", icon: <BookOpen className="w-4 h-4" /> },
            { to: "/blog", label: "ব্লগ", icon: <Newspaper className="w-4 h-4" /> },
        ]
    },
    {
        title: "অ্যাকাউন্ট",
        items: [
            { to: "/login", label: "লগইন", icon: <LogIn className="w-4 h-4" /> },
            { to: "/signup", label: "অ্যাকাউন্ট তৈরি", icon: <UserPlus className="w-4 h-4" /> },
        ]
    },
    {
        title: "রিসোর্স",
        items: [
            { to: "/analytics", label: "অ্যানালিটিক্স", icon: <BarChart3 className="w-4 h-4" /> },
            { to: "/settings", label: "সেটিংস", icon: <Settings className="w-4 h-4" /> },
            { to: "/help", label: "সাহায্য কেন্দ্র", icon: <HelpCircle className="w-4 h-4" /> },
        ]
    }
];

export default function SideNav({ isOpen, handleClose }: { isOpen: boolean, handleClose: () => void }) {
    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 select-none md:hidden bg-black/50 backdrop-blur-sm z-10"
                        onClick={handleClose}
                    />
                    <motion.nav
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                        }}
                        className='fixed inset-y-0 left-0 z-30 w-[300px] bg-white/95 dark:bg-black/95 border-r dark:border-r-gray-800 overflow-y-auto md:hidden backdrop-blur-md'
                    >
                        <div className='flex items-center justify-between h-[80px] px-4 border-b dark:border-b-gray-800'>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Text className='text-xl font-bold text-primary' label='ফ্ল্যাশকার্ড' />
                            </motion.div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <ModeToggle />
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                >
                                    <HiOutlineXMark className='h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors' />
                                </motion.button>
                            </div>
                        </div>

                        <div className='p-4 space-y-6'>
                            {menuItems.map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className='space-y-2'
                                >
                                    <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 px-2'>
                                        {section.title}
                                    </h3>
                                    {section.items.map((item, itemIndex) => (
                                        <motion.div
                                            key={item.to}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * (index + itemIndex + 1) }}
                                        >
                                            <Link 
                                                to={item.to} 
                                                className='flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200 hover:translate-x-1'
                                                onClick={handleClose}
                                            >
                                                <span className="text-gray-400 dark:text-gray-500 group-hover:text-primary">
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    );
}
