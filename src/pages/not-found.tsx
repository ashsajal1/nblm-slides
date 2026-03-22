import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { motion } from 'framer-motion'
import { HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2'

export default function NotFound() {
    return (
        <>
            <Seo title="৪০৪ | পৃষ্ঠা পাওয়া যায়নি" description="আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।" />
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-bold text-primary dark:text-primary mb-4"
                    >
                        ওহ! পৃষ্ঠা পাওয়া যায়নি
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto"
                    >
                        আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি বা সরিয়ে দেওয়া হয়েছে।
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
                            ফিরে যান
                        </Button>
                        <Link to='/' className="w-full sm:w-auto">
                            <Button className="w-full">
                                <HiOutlineHome className="mr-2 h-5 w-5" />
                                হোমে যান
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}
