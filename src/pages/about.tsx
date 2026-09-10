import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
    return(
        <main>
            <section className="relative min-h-screen flex flex-col items-center text-center px-6 bg-cover bg-bottom" style={{ backgroundImage: "url('/images/vendors-hero.jpg')" }}>
                <ul className='w-full flex justify-end align-middle gap-15 text-xl pt-[4vh] pb-[20vh] md:pr-30'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/contact">Contact Us</Link></li>
                </ul>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 text-5xl md:text-6xl font-serif text-gray-900 max-w-3xl leading-tight"
                    >
                    About Us
                </motion.h1>
            </section>

            <section className="relative min-h-screen flex flex-col items-center text-center px-6 bg-cover bg-center">
                <ul className='w-full flex justify-end align-middle gap-15 text-xl pt-[2vh] pb-[20vh] md:pr-5'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/contact">Contact Us</Link></li>
                </ul>
                <h1>About Us</h1>
            </section>
            <section className="relative min-h-screen flex flex-col items-center text-center px-6 bg-cover bg-center">
                <ul className='w-full flex justify-end align-middle gap-15 text-xl pt-[2vh] pb-[20vh] md:pr-5'>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/contact">Contact Us</Link></li>
                </ul>
                <h1>About Us</h1>
            </section>
        </main>
    )
}
