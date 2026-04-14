import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-forest relative overflow-hidden items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">FarmSphere</h1>
          </div>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            The modern AgriTech platform connecting farmers, investors, and buyers in a seamless ecosystem.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-white/60">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Active Farms</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">₦2.5B</p>
              <p>Invested</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p>Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
