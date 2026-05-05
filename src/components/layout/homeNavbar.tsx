import Link from 'next/link'
import { Roboto,Inter,Montserrat } from 'next/font/google'
 
const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
})


const websiteLinks = [
    { name: 'Home', href: '/' },
]

const websiteLinks1 = [
    { name: "Sign In", href: '/sign-in' },
    { name: "Sign Up", href: '/sign-up' }
]

export default function HomeNavbar() {

    return (
        <div className={`relative w-full h-[120px] bg-[#f1f9fc] text-gray-800 text-[14px] overflow-hidden ${inter.className}`} 
        >
            <div className='absolute  w-auto left-[24px] top-[44px] uppercase font-bold'>
                    <Link
                        key={'/'}
                        href={'/'}
                    >
                        Chime
                    </Link>
            </div>
            <div className=' w-[300px] mx-auto mt-[44px] flex justify-between uppercase font-bold hidden md:flex'>
                {/* {websiteLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                    >
                        {link.name}
                    </Link>
                ))} */}
            </div>
            <div className='absolute  w-[160px] right-[24px] top-[44px] flex justify-between uppercase font-bold'>
                {websiteLinks1.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}