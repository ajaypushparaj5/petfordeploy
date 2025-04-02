
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home, Menu, User, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onLogin, onSignup, onLogout }: HeaderProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/wishlist", label: "Wishlist", icon: <Heart size={20} /> },
    { path: "/my-pets", label: "My Pets", icon: <User size={20} /> },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-yellow-900 rounded-full p-1.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 11C5.88071 11 7 9.88071 7 8.5C7 7.11929 5.88071 6 4.5 6C3.11929 6 2 7.11929 2 8.5C2 9.88071 3.11929 11 4.5 11Z"
                  fill="black"
                />
                <path
                  d="M19.5 11C20.8807 11 22 9.88071 22 8.5C22 7.11929 20.8807 6 19.5 6C18.1193 6 17 7.11929 17 8.5C17 9.88071 18.1193 11 19.5 11Z"
                  fill="black"
                />
                <path
                  d="M8.5 6C9.88071 6 11 4.88071 11 3.5C11 2.11929 9.88071 1 8.5 1C7.11929 1 6 2.11929 6 3.5C6 4.88071 7.11929 6 8.5 6Z"
                  fill="black"
                />
                <path
                  d="M15.5 6C16.8807 6 18 4.88071 18 3.5C18 2.11929 16.8807 1 15.5 1C14.1193 1 13 2.11929 13 3.5C13 4.88071 14.1193 6 15.5 6Z"
                  fill="black"
                />
                <path
                  d="M12 13.5C14.2091 13.5 16 11.7091 16 9.5C16 7.29086 14.2091 5.5 12 5.5C9.79086 5.5 8 7.29086 8 9.5C8 11.7091 9.79086 13.5 12 13.5Z"
                  fill="black"
                />
                <path
                  d="M6 15.5V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V15.5C18 14.1193 19.1193 13 20.5 13C21.8807 13 23 14.1193 23 15.5V18C23 21.3137 20.3137 24 17 24H7C3.68629 24 1 21.3137 1 18V15.5C1 14.1193 2.11929 13 3.5 13C4.88071 13 6 14.1193 6 15.5Z"
                  fill="black"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">PetMagic</span>
          </Link>

          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>

              {mobileMenuOpen && (
                <div className="fixed inset-0 top-16 bg-white z-20 p-4 animate-fade-in">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg",
                          isActiveLink(link.path)
                            ? "bg-yellow-100 text-primary"
                            : "hover:bg-yellow-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    <div className="border-t border-gray-100 my-2 pt-2">
                      {isLoggedIn ? (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User size={20} />
                            <span>Profile</span>
                          </Link>
                          <Button
                            onClick={() => {
                              onLogout();
                              setMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full mt-2"
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => {
                              onLogin();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full bg-yellow-900 hover:bg-yellow-800 text-black"
                          >
                            Login
                          </Button>
                          <Button
                            onClick={() => {
                              onSignup();
                              setMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full"
                          >
                            Sign Up
                          </Button>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <>
              <nav className="flex-1 flex justify-center">
                <ul className="flex space-x-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={cn(
                          "nav-link flex items-center gap-1.5",
                          isActiveLink(link.path) && "nav-link-active"
                        )}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center space-x-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-1.5 nav-link"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                    <Button onClick={onLogout} variant="outline">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={onLogin}
                      className="bg-yellow-900 hover:bg-yellow-800 text-black"
                    >
                      Login
                    </Button>
                    <Button onClick={onSignup} variant="outline">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
