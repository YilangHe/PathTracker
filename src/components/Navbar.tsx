import React from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-600 shadow-lg">
      <div className="container max-w-4xl mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="PATH Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="hidden font-bold sm:inline-block text-white">
              Path Tracker
            </span>
          </a>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white/90 data-[active]:text-white data-[state=open]:text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 px-3 py-2 rounded-md transition-colors">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white border shadow-lg rounded-md">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md hover:from-blue-100 hover:to-blue-200 transition-colors"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-blue-900">
                          Real-time Arrivals
                        </div>
                        <p className="text-sm leading-tight text-blue-700">
                          Track PATH train arrivals in real-time with our live
                          dashboard
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/" title="Multi-Station View">
                    Monitor multiple stations simultaneously
                  </ListItem>
                  <ListItem href="/" title="Drag & Drop">
                    Reorder stations by dragging cards
                  </ListItem>
                  <ListItem href="/" title="Service Alerts">
                    Stay informed about service disruptions
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white/90 data-[active]:text-white data-[state=open]:text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 px-3 py-2 rounded-md transition-colors">
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border shadow-lg rounded-md">
                  <ListItem
                    title="About PATH"
                    href="https://www.panynj.gov/path"
                  >
                    Learn more about the PATH train system
                  </ListItem>
                  <ListItem
                    title="Data Source"
                    href="https://www.panynj.gov/path/en/schedules-maps.html"
                  >
                    Official PATH schedules and real-time data
                  </ListItem>
                  <ListItem
                    title="Add to Home Screen"
                    href="/add-to-home-screen"
                  >
                    Install this app on your device for quick access
                  </ListItem>
                  <ListItem title="Disclaimer" href="/disclaimer">
                    Important legal information and data sources
                  </ListItem>
                  <ListItem title="Privacy" href="/">
                    Your data stays on your device
                  </ListItem>
                  <ListItem
                    title="Contact"
                    href="mailto:livepathtracker@gmail.com"
                  >
                    Questions or feedback about this app
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto">
          <a
            href="/add-to-home-screen"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors sm:px-4"
          >
            <svg
              className="w-4 h-4 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </a>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 text-gray-900",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
