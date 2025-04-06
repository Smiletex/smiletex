'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartContext } from '@/components/CartProvider';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useCategories, CategoryWithChildren } from '@/hooks/useProducts';
import { FaLeaf } from 'react-icons/fa';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [collectionMenuOpen, setCollectionMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const collectionMenuRef = useRef<HTMLDivElement>(null);
  const closeCollectionMenuTimer = useRef<NodeJS.Timeout | null>(null);
  const { itemCount } = useCartContext();
  const { user } = useAuth();
  const pathname = usePathname();
  // Utiliser hierarchicalCategories pour avoir accès à la structure parent-enfant
  const { categories, hierarchicalCategories, loading: categoriesLoading } = useCategories(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setProductsMenuOpen(false);
      }
      if (collectionMenuRef.current && !collectionMenuRef.current.contains(event.target as Node)) {
        setCollectionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Bande d'informations au-dessus du header */}
      <div className="bg-white text-gray-800 py-1.5 text-xs md:text-sm border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center">
                <div className="flex mr-1.5 w-3 items-center">
                  <div className="h-1 w-full bg-blue-600"></div>
                  <div className="h-1 w-full bg-white"></div>
                  <div className="h-1 w-full bg-red-600"></div>
                </div>
                <span>Made in France</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Disponible 7j/7</span>
              </div>
            </div>
            <div className="flex items-center md:ml-0 w-full md:w-auto justify-center md:justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">Appeler un expert : <a href="tel:0641323504" className="text-indigo-600 hover:underline">06 41 32 35 04</a></span>
            </div>
          </div>
        </div>
      </div>
      <header className={`${scrolled ? 'bg-white' : 'bg-indigo-50'} text-black shadow-md sticky top-0 transition-all duration-300 ease-in-out z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="Smiletex" 
                width={150} 
                height={40} 
                className="h-10 w-auto transition-opacity duration-300"
                priority
              />
            </Link>
          </div>

          {/* Navigation centrale sur PC */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <nav className="flex space-x-8">
              <div 
                ref={productsMenuRef} 
                className="relative h-16 flex items-center"
                onMouseEnter={() => setProductsMenuOpen(true)}
                onMouseLeave={() => setProductsMenuOpen(false)}
              >
                <Link 
                  href="/products" 
                  className={`${pathname === '/products' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-black hover:text-indigo-700'} px-3 py-2 rounded-md text-base font-medium flex items-center h-16 transition-all duration-200`}
                  onClick={() => setProductsMenuOpen(false)}
                >
                  <span>Produits</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${productsMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* Sous-menu des catégories */}
                <div 
                  className={`absolute top-16 left-0 w-56 bg-white shadow-lg rounded-md py-2 transition-all duration-200 z-50 ${productsMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <Link 
                    href="/products" 
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    onClick={() => setProductsMenuOpen(false)}
                  >
                    Tous les produits
                  </Link>
                  {categoriesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                  ) : (
                    hierarchicalCategories
                      .filter(category => 
                        category.name.toLowerCase() !== "bio" && 
                        category.name.toLowerCase() !== "made in france"
                      )
                      .map(category => (
                        <div 
                          key={category.id} 
                          className="relative"
                          onMouseEnter={() => setHoveredCategory(category.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <Link 
                            href={`/products?category=${category.id}`}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            onClick={() => setProductsMenuOpen(false)}
                          >
                            <span>{category.name}</span>
                            {category.children && category.children.length > 0 && (
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </Link>
                          
                          {/* Sous-catégories qui apparaissent à droite au survol */}
                          {category.children && category.children.length > 0 && hoveredCategory === category.id && (
                            <div className="absolute left-full top-0 w-56 bg-white shadow-lg rounded-md py-2 -ml-1 z-50">
                              {category.children
                                .filter(childCategory => 
                                  childCategory.name.toLowerCase() !== "bio" && 
                                  childCategory.name.toLowerCase() !== "made in france"
                                )
                                .map(childCategory => (
                                  <Link 
                                    key={childCategory.id} 
                                    href={`/products?category=${childCategory.id}`}
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                    onClick={() => {
                                      setProductsMenuOpen(false);
                                      setHoveredCategory(null);
                                    }}
                                  >
                                    {childCategory.name}
                                  </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
              <Link href="/devis" className={`${pathname === '/devis' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-black hover:text-indigo-700'} px-3 py-2 rounded-md text-base font-medium flex items-center h-16 transition-all duration-200`}>
                Devis Rapide
              </Link>
              <Link href="/about" className={`${pathname === '/about' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-black hover:text-indigo-700'} px-3 py-2 rounded-md text-base font-medium flex items-center h-16 transition-all duration-200`}>
                À propos
              </Link>
              <div 
                ref={collectionMenuRef}
                className="relative h-16 flex items-center"
                onMouseEnter={() => {
                  if (closeCollectionMenuTimer.current) {
                    clearTimeout(closeCollectionMenuTimer.current);
                    closeCollectionMenuTimer.current = null;
                  }
                  setCollectionMenuOpen(true);
                }}
                onMouseLeave={() => {
                  closeCollectionMenuTimer.current = setTimeout(() => {
                    setCollectionMenuOpen(false);
                  }, 500); // 500ms de délai avant fermeture pour faciliter la navigation
                }}
              >
                <Link 
                  href="/products"
                  className={`${pathname === '/products' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-black hover:text-indigo-700'} px-3 py-2 rounded-md text-base font-medium flex items-center h-16 transition-all duration-200`}
                >
                  Collection
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* Menu déroulant pour Collection (Bio et Made in France uniquement) */}
                <div 
                  className={`absolute top-16 right-0 w-56 bg-white shadow-lg rounded-md py-2 z-50 transition-all duration-300 ${collectionMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closeCollectionMenuTimer.current) {
                      clearTimeout(closeCollectionMenuTimer.current);
                      closeCollectionMenuTimer.current = null;
                    }
                    setCollectionMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeCollectionMenuTimer.current = setTimeout(() => {
                      setCollectionMenuOpen(false);
                    }, 500);
                  }}
                >
                    {categoriesLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                    ) : (
                      categories
                        .filter(category => 
                          category.name.toLowerCase() === "bio" || 
                          category.name.toLowerCase() === "made in france"
                        )
                        .map(category => (
                          <Link 
                            key={category.id} 
                            href={`/products?category=${category.id}`}
                            className={`flex items-center px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${category.name.toLowerCase() === 'bio' ? 'text-green-600 font-medium' : 'text-gray-800 hover:text-indigo-700'}`}
                            onClick={() => setCollectionMenuOpen(false)}
                          >
                            {category.name.toLowerCase() === 'bio' && (
                              <span className="mr-2">
                                <FaLeaf className="h-5 w-5 text-green-600" />
                              </span>
                            )}
                            {category.name.toLowerCase() === 'made in france' && (
                              <span className="mr-2 flex items-center justify-center w-5 h-5 overflow-hidden rounded-full border border-gray-200">
                                <div className="flex flex-row">
                                  <div className="w-1.5 h-5 bg-blue-700"></div>
                                  <div className="w-1.5 h-5 bg-white"></div>
                                  <div className="w-1.5 h-5 bg-red-600"></div>
                                </div>
                              </span>
                            )}
                            {category.name}
                          </Link>
                        ))
                    )}
                </div>
              </div>
            </nav>
          </div>

          {/* Panier, connexion et menu mobile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center">
                <Link 
                  href="/account" 
                  className={`flex items-center space-x-2 ${pathname === '/account' ? 'text-indigo-700' : 'text-black hover:text-indigo-700'} transition-colors duration-200`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`text-sm font-medium ${scrolled ? 'text-indigo-800 hover:text-indigo-600' : 'text-black hover:text-indigo-700'} transition-colors duration-200`}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className={`${scrolled ? 'bg-indigo-700' : 'bg-indigo-600'} text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Inscription
                </Link>
              </div>
            )}
            <Link href="/cart" className={`p-2 ${scrolled ? 'text-indigo-800 hover:text-indigo-600' : 'text-black hover:text-indigo-700'} relative transition-colors duration-200`}>
              <span className="sr-only">Panier</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-black hover:text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay sombre */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Panneau du menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-64 bg-indigo-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-black hover:text-indigo-700"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-2 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150">
                <Link 
                  href="/products" 
                  className="flex-grow"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Produits
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const submenu = document.getElementById('mobile-products-submenu');
                    if (submenu) {
                      submenu.classList.toggle('hidden');
                    }
                  }}
                  className="p-1"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Sous-menu mobile des catégories */}
              <div id="mobile-products-submenu" className="pl-4 hidden space-y-1">
                <Link 
                  href="/products" 
                  className="block px-4 py-2 text-sm font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tous les produits
                </Link>
                {categoriesLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                ) : (
                  categories
                    .filter(category => 
                      category.name.toLowerCase() !== "bio" && 
                      category.name.toLowerCase() !== "made in france"
                    )
                    .map(category => (
                      <Link 
                        key={category.id} 
                        href={`/products?category=${category.id}`}
                        className="block px-4 py-2 text-sm font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                )}
              </div>
            </div>
            <Link 
              href="/devis" 
              className="block px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              Devis rapide
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150">
                <Link 
                  href="/products" 
                  className="flex-grow"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collection
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const submenu = document.getElementById('mobile-collection-submenu');
                    if (submenu) {
                      submenu.classList.toggle('hidden');
                    }
                  }}
                  className="p-1"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Sous-menu mobile des collections Bio et Made in France */}
              <div id="mobile-collection-submenu" className="pl-4 hidden space-y-1">
                {categoriesLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                ) : (
                  categories
                    .filter(category => 
                      category.name.toLowerCase() === "bio" || 
                      category.name.toLowerCase() === "made in france"
                    )
                    .map(category => (
                      <Link 
                        key={category.id} 
                        href={`/products?category=${category.id}`}
                        className="block px-4 py-2 text-sm font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                )}
              </div>
            </div>
            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="block px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon compte
                </Link>

              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-base font-medium text-black hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors duration-150"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-150"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
