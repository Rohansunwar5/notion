'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../../../public/SynthifyHub.png'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const routes = [
  { title: 'Features', href: '#features'},
  { title: 'Resources', href: '#resources'},
  { title: 'Pricing', href: '#pricing'},
  { title: 'Testimonials', href: '#testimonial'},
];

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '#',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '#',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '#',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '#',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '#',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '#',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];


const Header = () => {

  const [path, setPath] = useState('#products');
  return (
   <header
    className='p-4 flex justify-center items-center'
   >
    <Link 
    href={'/'}
    className='w-full flex gap-2 justify-left items-center'
    >
    <Image
      src={Logo}
      alt="SynthifyHub Logo"
      width={25}
      height={25}
   />
    <span
      className='font-semibold dark:text-white'
    >
      Synthify.
    </span>
    </Link>
    <NavigationMenu className='hidden md:block'>
      <NavigationMenuList className='gap-6'>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onClick={() => setPath('#resources')}
            className={cn({
              'dark:text-white':path === '#resources',
              'dark:text-white/40':path !== '#resources',
              'font-normal':true,
              'text-xl':true,
            })}
          >
            Resources
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
   </header>
  )
}

export default Header