import { Link, useLocation } from "wouter";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

function getTierFromChatCount(chatCount: number) {
  if (chatCount === 0) return { tier: "unranked", label: "Novato", color: "rgb(107, 114, 128)" };
  if (chatCount >= 1 && chatCount < 5) return { tier: "bronze", label: "Bronze", color: "rgb(205, 127, 50)" };
  if (chatCount >= 5 && chatCount < 10) return { tier: "silver", label: "Prata", color: "rgb(192, 192, 192)" };
  if (chatCount >= 10 && chatCount < 25) return { tier: "gold", label: "Ouro", color: "rgb(255, 215, 0)" };
  if (chatCount >= 25 && chatCount < 50) return { tier: "platinum", label: "Platina", color: "rgb(229, 228, 226)" };
  return { tier: "diamond", label: "Diamante", color: "rgb(185, 242, 255)" };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const tierInfo = user ? getTierFromChatCount(user.chatCount) : { tier: "unranked", label: "Novato", color: "rgb(107, 114, 128)" };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-serif font-bold text-xl group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">ArtVision</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Analyze
            </Link>
            <Link href="/history" className={`text-sm font-medium hover:text-primary transition-colors ${location === '/history' ? 'text-primary' : 'text-muted-foreground'}`}>
              History
            </Link>
            
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0" data-testid="button-user-menu">
                    <div className="relative h-full w-full">
                      <Avatar className="h-10 w-10 border-2" style={{ borderColor: tierInfo.color }}>
                        <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-xs font-bold text-white bg-black/80 border" style={{ borderColor: tierInfo.color }}>
                        {user.chatCount}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3 border-b border-white/10">
                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: tierInfo.color }}>
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none flex-1">
                      <div>
                        {user.firstName && (
                          <p className="font-medium" data-testid="text-user-name">{user.firstName} {user.lastName}</p>
                        )}
                      </div>
                      {user.email && (
                        <p className="w-[150px] truncate text-xs text-muted-foreground" data-testid="text-user-email">
                          {user.email}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tierInfo.color }}></div>
                        <p className="text-xs font-semibold" data-testid="text-user-tier">{tierInfo.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-2 text-xs text-muted-foreground" data-testid="text-chat-count">
                    Mensagens: {user.chatCount}
                  </div>
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                onClick={handleLogin}
                data-testid="button-signin"
              >
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            {!isLoading && isAuthenticated && user && (
              <div className="relative">
                <Avatar className="h-8 w-8 border-2" style={{ borderColor: tierInfo.color }}>
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full w-4 h-4 text-xs font-bold text-white bg-black/80 border flex items-center justify-center" style={{ borderColor: tierInfo.color }}>
                  {user.chatCount < 99 ? user.chatCount : "99+"}
                </div>
              </div>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-white/10 bg-black/95">
                <div className="flex flex-col gap-6 mt-10">
                  <Link href="/" className="text-lg font-serif hover:text-primary">
                    Analyze Art
                  </Link>
                  <Link href="/history" className="text-lg font-serif hover:text-primary">
                    History
                  </Link>
                  {isAuthenticated && user ? (
                    <>
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8 border-2" style={{ borderColor: tierInfo.color }}>
                            <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{tierInfo.label}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="justify-start"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleLogin}
                      className="justify-start"
                      data-testid="button-mobile-signin"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-black/50 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="font-serif italic mb-2">"Art is not what you see, but what you make others see."</p>
          <p>&copy; 2025 ArtVision. Powered by Advanced AI.</p>
        </div>
      </footer>
    </div>
  );
}
