import React, { useState } from "react";
import { Trophy, Users, MapPin, Database, X, Menu } from "lucide-react";
import { usePopulateDemoData } from "../hooks/usePopulateDemoData";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { populateDemoData } = usePopulateDemoData();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Liga Castrol</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => setActiveTab("leagues")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === "leagues"
                    ? "border-green-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Ligas
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === "teams"
                    ? "border-green-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Equipos
              </button>
              <button
                onClick={() => setActiveTab("locations")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === "locations"
                    ? "border-green-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ubicaciones
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

          {/* Demo data button */}
          <div className="hidden md:flex md:items-center">
            <button
              onClick={populateDemoData}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Datos Demo
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => {
              setActiveTab("leagues");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === "leagues"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
            }`}
          >
            <Trophy className="h-5 w-5 mr-3" />
            Ligas
          </button>
          <button
            onClick={() => {
              setActiveTab("teams");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === "teams"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Equipos
          </button>
          <button
            onClick={() => {
              setActiveTab("locations");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === "locations"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
            }`}
          >
            <MapPin className="h-5 w-5 mr-3" />
            Ubicaciones
          </button>
          <button
            onClick={() => {
              populateDemoData();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            <Database className="h-5 w-5 mr-3" />
            Datos Demo
          </button>
        </div>
      </div>
    </nav>
  );
}
