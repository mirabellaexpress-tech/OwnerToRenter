"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  PlusCircle, 
  Phone, 
  ShieldCheck, 
  Heart, 
  Trash2, 
  User, 
  Sparkles, 
  FileText, 
  Eye, 
  DollarSign, 
  Smartphone, 
  Building, 
  Home, 
  Briefcase, 
  Box, 
  Car, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  X,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Video,
  Map,
  Compass,
  MessageSquare,
  Calendar,
  Star,
  Printer,
  ChevronRight,
  UserCheck,
  Zap,
  Info
} from "lucide-react";

const CATEGORIES = [
  { name: "House", icon: Home },
  { name: "Apartment", icon: Building },
  { name: "Shop", icon: Briefcase },
  { name: "Office", icon: Building },
  { name: "Warehouse", icon: Box },
  { name: "Car", icon: Car },
  { name: "Bike", icon: Smartphone },
  { name: "Machinery", icon: Settings },
  { name: "Other", icon: Sparkles }
];

const PAK_CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Faisalabad"];

const BACKEND_URL = "http://localhost:5050/api";

export default function HomeApp() {
  // Theme State
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // App States
  const [listings, setListings] = useState([]);
  const [tenantRequests, setTenantRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid, map
  
  // Navigation / Tab States
  const [currentView, setCurrentView] = useState("home"); // home, dashboard, add-listing, agreement-generator
  const [dashboardTab, setDashboardTab] = useState("my-listings"); // my-listings (owner), saved (tenant), requests
  const [feedTab, setFeedTab] = useState("listings"); // listings, tenant-requests

  // Search State
  const [searchCity, setSearchCity] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchMinRent, setSearchMinRent] = useState("");
  const [searchMaxRent, setSearchMaxRent] = useState("");
  const [searchText, setSearchText] = useState("");

  // AI Assistant Search
  const [aiQuery, setAiQuery] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  // Smart Filters State
  const [familyOnly, setFamilyOnly] = useState(false);
  const [bachelorAllowed, setBachelorAllowed] = useState(false);
  const [furnished, setFurnished] = useState("Any");
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [generatorBackup, setGeneratorBackup] = useState(false);
  const [solarInstalled, setSolarInstalled] = useState(false);

  // Auth State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // login, register-owner, register-tenant

  // Auth Forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Registration Forms
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCnic, setRegCnic] = useState("");
  const [regCity, setRegCity] = useState("Islamabad");
  const [regPassword, setRegPassword] = useState("");

  // Add Listing Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("House");
  const [newCity, setNewCity] = useState("Islamabad");
  const [newArea, setNewArea] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRent, setNewRent] = useState("");
  const [newDeposit, setNewDeposit] = useState("");
  const [newImages, setNewImages] = useState(["", ""]);
  const [newPhone, setNewPhone] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newAvailability, setNewAvailability] = useState("Now");
  const [newFamilyOnly, setNewFamilyOnly] = useState(true);
  const [newBachelorAllowed, setNewBachelorAllowed] = useState(false);
  const [newFurnished, setNewFurnished] = useState("Unfurnished");
  const [newParking, setNewParking] = useState(true);
  const [newGenerator, setNewGenerator] = useState(false);
  const [newSolar, setNewSolar] = useState(false);
  const [listingError, setListingError] = useState("");
  const [listingSuccess, setListingSuccess] = useState("");

  // Tenant Request Post Form
  const [reqTitle, setReqTitle] = useState("");
  const [reqCat, setReqCat] = useState("House");
  const [reqCity, setReqCity] = useState("Islamabad");
  const [reqArea, setReqArea] = useState("");
  const [reqBudget, setReqBudget] = useState("");
  const [reqPhone, setReqPhone] = useState("");
  const [showReqModal, setShowReqModal] = useState(false);

  // Rental Agreement Generator Form
  const [agOwnerName, setAgOwnerName] = useState("");
  const [agOwnerCnic, setAgOwnerCnic] = useState("");
  const [agTenantName, setAgTenantName] = useState("");
  const [agTenantCnic, setAgTenantCnic] = useState("");
  const [agPropAddress, setAgPropAddress] = useState("");
  const [agRent, setAgRent] = useState("");
  const [agDeposit, setAgDeposit] = useState("");
  const [agDuration, setAgDuration] = useState("11 Months");
  const [generatedAgreement, setGeneratedAgreement] = useState(null);

  // Built-in Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatOwner, setChatOwner] = useState(null);

  // Rent Estimator Tool
  const [estCity, setEstCity] = useState("Islamabad");
  const [estArea, setEstArea] = useState("");
  const [estCat, setEstCat] = useState("House");
  const [estimatedRent, setEstimatedRent] = useState(null);

  // Move-in Cost Calculator
  const [calcRent, setCalcRent] = useState(0);
  const [calcDeposit, setCalcDeposit] = useState(0);
  const [calcUtilities, setCalcUtilities] = useState(8000);
  const [calcAdvance, setCalcAdvance] = useState(0);

  // Favorites/History (Client Side backup)
  const [favorites, setFavorites] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);

  // Fetch listings with smart filters
  const fetchListings = async (customParams = null) => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/listings`;
      const params = customParams || {
        city: searchCity,
        area: searchArea,
        category: searchCategory,
        minRent: searchMinRent,
        maxRent: searchMaxRent,
        search: searchText,
        familyOnly: familyOnly.toString(),
        bachelorAllowed: bachelorAllowed.toString(),
        furnished: furnished,
        parkingAvailable: parkingAvailable.toString(),
        generatorBackup: generatorBackup.toString(),
        solarInstalled: solarInstalled.toString()
      };

      const queryParts = [];
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== null) {
          queryParts.push(`${key}=${encodeURIComponent(val)}`);
        }
      });
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.warn("Backend offline, loading fallback data", err);
      // Fallback Seed Data
      setListings([
        {
          id: 1,
          title: "Furnished 2 Bedroom Apartment in F-11",
          description: "A beautiful luxury apartment with all modern amenities, 24/7 security, backup generator, and dedicated parking. Walking distance to F-11 Markaz.",
          category: "Apartment",
          city: "Islamabad",
          area: "F-11",
          address: "Silver Oaks, F-11 Markaz, Islamabad",
          rent: 75000,
          deposit: 150000,
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          availability: 'Now',
          family_only: 1,
          bachelor_allowed: 0,
          furnished: 'Fully Furnished',
          parking_available: 1,
          generator_backup: 1,
          solar_installed: 0,
          metro_dist: '300m from F-11 Metro Station',
          school_dist: '500m from Beaconhouse School',
          hospital_dist: '1.2km from Shifa Medical Center',
          rating: 4.8,
          owner_name: "Ali Khan",
          owner_phone: "+92 300 1234567",
          owner_verified: 1,
          main_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
          ]
        },
        {
          id: 2,
          title: "1 Kanal Beautiful House for Rent in DHA Phase 2",
          description: "Brand new construction, 5 master bedrooms with attached baths, double kitchen, spacious lawn, and garage space for 3 cars. Prime location near commercial area.",
          category: "House",
          city: "Islamabad",
          area: "DHA Phase 2",
          address: "Sector B, DHA Phase 2, Islamabad",
          rent: 180000,
          deposit: 360000,
          video_url: '',
          availability: 'Next Month',
          family_only: 1,
          bachelor_allowed: 0,
          furnished: 'Semi-Furnished',
          parking_available: 1,
          generator_backup: 0,
          solar_installed: 1,
          metro_dist: '2.5km from DHA Metro link',
          school_dist: '200m from Roots Millennium School',
          hospital_dist: '800m from DHA Medical Clinic',
          rating: 5.0,
          owner_name: "Ali Khan",
          owner_phone: "+92 300 1234567",
          owner_verified: 1,
          main_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
          ]
        },
        {
          id: 3,
          title: "Commercial Office Space in Blue Area",
          description: "Fully furnished office space with partitions, conference room, high-speed fiber internet connection, and server room setup. Excellent view of Margalla Hills.",
          category: "Office",
          city: "Islamabad",
          area: "Blue Area",
          address: "Saudi Pak Tower, Blue Area, Islamabad",
          rent: 120000,
          deposit: 240000,
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          availability: 'Now',
          family_only: 0,
          bachelor_allowed: 1,
          furnished: 'Fully Furnished',
          parking_available: 1,
          generator_backup: 1,
          solar_installed: 1,
          metro_dist: '100m from Stock Exchange Metro Station',
          school_dist: '1.5km from FG College',
          hospital_dist: '600m from Kulsum International Hospital',
          rating: 4.5,
          owner_name: "Zainab Bibi",
          owner_phone: "+92 312 9876543",
          owner_verified: 1,
          main_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
          ]
        },
        {
          id: 4,
          title: "Bachelor Studio Apartment in Saddar",
          description: "Ideal for students or young professionals. Safe area, separate electricity meter, 24 hours water supply, walking distance to shops.",
          category: "Apartment",
          city: "Rawalpindi",
          area: "Saddar",
          address: "Bank Road, Saddar, Rawalpindi",
          rent: 28000,
          deposit: 50000,
          video_url: '',
          availability: 'Now',
          family_only: 0,
          bachelor_allowed: 1,
          furnished: 'Unfurnished',
          parking_available: 0,
          generator_backup: 0,
          solar_installed: 0,
          metro_dist: '400m from Saddar Metro Station',
          school_dist: '800m from Army Public School',
          hospital_dist: '500m from Cantt General Hospital',
          rating: 4.2,
          owner_name: "Zainab Bibi",
          owner_phone: "+92 312 9876543",
          owner_verified: 1,
          main_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Tenant Requests board
  const fetchTenantRequests = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/listings/requests/all`);
      if (res.ok) {
        const data = await res.json();
        setTenantRequests(data);
      }
    } catch (err) {
      // Mock fallback tenant requests
      setTenantRequests([
        {
          id: 1,
          tenant_name: "Hamza Ahmed",
          title: "Looking for a 2 Bedroom House inside Bahria Town",
          category: "House",
          city: "Rawalpindi",
          area: "Bahria Town Phase 8",
          budget: 35000,
          phone: "+92 345 5554433"
        },
        {
          id: 2,
          tenant_name: "Umer Sheikh",
          title: "Studio Apartment or Shared room needed in Blue Area",
          category: "Apartment",
          city: "Islamabad",
          area: "Blue Area",
          budget: 22000,
          phone: "+92 321 4455667"
        }
      ]);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchListings();
    fetchTenantRequests();
    
    // Check dark mode state from document root
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true);
    }

    // Check locally saved user session
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch Dashboard specifics
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");

    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/listings/my/listings`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMyListings(data);
        }
      } catch (e) {
        setMyListings(listings.filter(l => l.owner_name === user.name));
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/listings/my/favorites`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (e) {
        const storedFavs = JSON.parse(localStorage.getItem(`favs_${user.id}`) || "[]");
        setFavorites(storedFavs);
      }
    };

    fetchMyListings();
    fetchFavorites();
  }, [user, currentView, dashboardTab]);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  // AI Assistant Search Query Parser (Natural Language logic)
  const handleAiQuerySubmit = (e) => {
    e.preventDefault();
    if (!aiQuery) return;

    setAiFeedback("Analyzing with AI Assistant...");
    
    // Simple Client-side parsing using Regex
    const queryLower = aiQuery.toLowerCase();
    
    let city = "";
    let maxRent = "";
    let category = "";
    let area = "";

    // Parse City
    if (queryLower.includes("islamabad")) city = "Islamabad";
    else if (queryLower.includes("rawalpindi") || queryLower.includes("pindi")) city = "Rawalpindi";
    else if (queryLower.includes("lahore")) city = "Lahore";
    else if (queryLower.includes("karachi")) city = "Karachi";

    // Parse Budget/Rent (e.g. "30 hazar", "30k", "35000", "30 thousand")
    const rentRegex = /(\d+)\s*(hazar|k|thousand|000)/i;
    const match = queryLower.match(rentRegex);
    if (match) {
      let val = parseInt(match[1]);
      if (match[2].toLowerCase() === "hazar" || match[2].toLowerCase() === "k" || match[2].toLowerCase() === "thousand") {
        val = val * 1000;
      }
      maxRent = val.toString();
    } else {
      // Direct number match like "35000"
      const numberMatch = queryLower.match(/\b\d{5}\b/);
      if (numberMatch) {
        maxRent = numberMatch[0];
      }
    }

    // Parse Category
    if (queryLower.includes("apartment") || queryLower.includes("flat")) category = "Apartment";
    else if (queryLower.includes("house") || queryLower.includes("ghar")) category = "House";
    else if (queryLower.includes("office")) category = "Office";
    else if (queryLower.includes("shop") || queryLower.includes("dukan")) category = "Shop";
    else if (queryLower.includes("car") || queryLower.includes("gari")) category = "Car";

    // Parse Area Keywords
    const areaKeywords = ["f-11", "dha", "bahria", "saddar", "blue area", "g-11", "i-8", "f-6", "e-11"];
    for (const keyword of areaKeywords) {
      if (queryLower.includes(keyword)) {
        area = keyword.toUpperCase();
        break;
      }
    }

    // Apply parsed states
    setSearchCity(city);
    setSearchMaxRent(maxRent);
    setSearchCategory(category);
    setSearchArea(area);

    setAiFeedback(`AI Filters Applied: ${city ? `City: ${city}` : ""} ${category ? `| Category: ${category}` : ""} ${maxRent ? `| Max Budget: Rs. ${parseInt(maxRent).toLocaleString()}` : ""} ${area ? `| Area: ${area}` : ""}`);

    fetchListings({
      city,
      area,
      category,
      minRent: "",
      maxRent,
      search: "",
      familyOnly: familyOnly.toString(),
      bachelorAllowed: bachelorAllowed.toString(),
      furnished,
      parkingAvailable: parkingAvailable.toString(),
      generatorBackup: generatorBackup.toString(),
      solarInstalled: solarInstalled.toString()
    });
  };

  // Rent Estimator Logic
  const handleEstimateRent = () => {
    if (!estArea) {
      alert("Please enter an area name to estimate rent.");
      return;
    }
    
    // Average calculations based on simulated data
    let base = 35000;
    if (estCity === "Islamabad") base += 20000;
    if (estCat === "Apartment") base -= 10000;
    if (estCat === "Office" || estCat === "Shop") base += 15000;
    if (estArea.toLowerCase().includes("f-11") || estArea.toLowerCase().includes("dha") || estArea.toLowerCase().includes("bahria")) {
      base += 25000;
    }

    setEstimatedRent({
      min: base - 5000,
      max: base + 15000,
      avg: base + 5000
    });
  };

  // Tenant Request Post Handler
  const handlePostTenantRequest = async (e) => {
    e.preventDefault();
    if (!reqTitle || !reqArea || !reqBudget) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      title: reqTitle,
      category: reqCat,
      city: reqCity,
      area: reqArea,
      budget: parseFloat(reqBudget),
      phone: reqPhone || user?.phone || "+92 300 0000000"
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/listings/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Tenant requirement posted successfully!");
        setShowReqModal(false);
        fetchTenantRequests();
      }
    } catch(e) {
      // Simulation mode
      const mockReq = {
        id: Date.now(),
        tenant_name: user?.name || "Guest Tenant",
        title: reqTitle,
        category: reqCat,
        city: reqCity,
        area: reqArea,
        budget: parseFloat(reqBudget),
        phone: reqPhone || user?.phone || "+92 300 0000000"
      };
      setTenantRequests([mockReq, ...tenantRequests]);
      alert("Tenant requirement posted successfully (Simulation Mode)!");
      setShowReqModal(false);
    }
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setAuthSuccess("Logged in successfully!");
        setTimeout(() => {
          setShowAuthModal(false);
          setLoginEmail("");
          setLoginPassword("");
        }, 1000);
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch (err) {
      // Mock login for offline dev
      if (loginEmail && loginPassword === "password123") {
        const mockUser = {
          id: loginEmail.includes("owner") ? 101 : 102,
          name: loginEmail.includes("owner") ? "Ali Khan" : "Hamza Ahmed",
          email: loginEmail,
          phone: "+92 300 1234567",
          role: loginEmail.includes("owner") ? "owner" : "tenant",
          verified: loginEmail.includes("owner")
        };
        localStorage.setItem("token", "mocktoken");
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setAuthSuccess("Logged in successfully (Dev Mode)!");
        setTimeout(() => setShowAuthModal(false), 1000);
      } else {
        setAuthError("Could not connect to server. Use credentials (ali@example.com / password123) for offline login.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    const role = authTab === "register-owner" ? "owner" : "tenant";
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          cnic: role === "owner" ? regCnic : undefined,
          city: role === "owner" ? regCity : undefined,
          password: regPassword,
          role
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess("Registration successful! You can now log in.");
        setAuthTab("login");
        setLoginEmail(regEmail);
      } else {
        setAuthError(data.error || "Registration failed");
      }
    } catch (err) {
      setAuthSuccess("Registration simulated successfully! Try logging in.");
      setAuthTab("login");
      setLoginEmail(regEmail);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("home");
  };

  // Listings Action Handlers
  const handleSaveListing = async (listing) => {
    if (!user) {
      setShowAuthModal(true);
      setAuthTab("login");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/listings/${listing.id}/favorite`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        if (!favorites.some(f => f.id === listing.id)) {
          setFavorites([...favorites, listing]);
        }
      }
    } catch (e) {
      const storedFavs = JSON.parse(localStorage.getItem(`favs_${user.id}`) || "[]");
      if (!storedFavs.some(f => f.id === listing.id)) {
        const updated = [...storedFavs, listing];
        localStorage.setItem(`favs_${user.id}`, JSON.stringify(updated));
        setFavorites(updated);
      }
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/listings/${listingId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMyListings(myListings.filter(l => l.id !== listingId));
        setListings(listings.filter(l => l.id !== listingId));
      }
    } catch (e) {
      setMyListings(myListings.filter(l => l.id !== listingId));
      setListings(listings.filter(l => l.id !== listingId));
    }
  };

  const handleAddListingSubmit = async (e) => {
    e.preventDefault();
    setListingError("");
    setListingSuccess("");

    if (!newTitle || !newRent || !newDeposit || !newArea || !newAddress) {
      setListingError("Please fill out all required fields.");
      return;
    }

    const payload = {
      title: newTitle,
      description: newDesc,
      category: newCat,
      city: newCity,
      area: newArea,
      address: newAddress,
      rent: parseFloat(newRent),
      deposit: parseFloat(newDeposit),
      images: newImages.filter(img => img !== ""),
      video_url: newVideoUrl,
      availability: newAvailability,
      family_only: newFamilyOnly,
      bachelor_allowed: newBachelorAllowed,
      furnished: newFurnished,
      parking_available: newParking,
      generator_backup: newGenerator,
      solar_installed: newSolar,
      phone: newPhone || user?.phone,
      whatsapp: newWhatsapp || newPhone || user?.phone
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setListingSuccess("Property listed successfully!");
        fetchListings();
        setTimeout(() => {
          setCurrentView("dashboard");
          setDashboardTab("my-listings");
          setNewTitle("");
          setNewDesc("");
          setNewArea("");
          setNewAddress("");
          setNewRent("");
          setNewDeposit("");
          setNewVideoUrl("");
          setNewImages(["", ""]);
        }, 1200);
      } else {
        const errData = await res.json();
        setListingError(errData.error || "Failed to submit listing");
      }
    } catch (e) {
      // Simulate for local dev
      const mockNewListing = {
        id: Date.now(),
        user_id: user.id,
        title: newTitle,
        description: newDesc,
        category: newCat,
        city: newCity,
        area: newArea,
        address: newAddress,
        rent: parseFloat(newRent),
        deposit: parseFloat(newDeposit),
        video_url: newVideoUrl,
        availability: newAvailability,
        family_only: newFamilyOnly ? 1 : 0,
        bachelor_allowed: newBachelorAllowed ? 1 : 0,
        furnished: newFurnished,
        parking_available: newParking ? 1 : 0,
        generator_backup: newGenerator ? 1 : 0,
        solar_installed: newSolar ? 1 : 0,
        owner_name: user.name,
        owner_phone: newPhone || user.phone,
        owner_verified: user.verified ? 1 : 0,
        main_image: newImages[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
        images: newImages.filter(img => img !== "")
      };
      setListings([mockNewListing, ...listings]);
      setListingSuccess("Property listed successfully (Dev Simulation Mode)!");
      setTimeout(() => {
        setCurrentView("dashboard");
        setDashboardTab("my-listings");
        setNewTitle("");
        setNewDesc("");
        setNewArea("");
        setNewAddress("");
        setNewRent("");
        setNewDeposit("");
        setNewVideoUrl("");
      }, 1200);
    }
  };

  // Chat System Simulation Handlers
  const openChatWithOwner = (listing) => {
    setChatOwner(listing);
    setChatOpen(true);
    setChatMessages([
      { sender: "system", text: `Secure connection initialized. Direct chat with ${listing.owner_name} (Owner).` },
      { sender: "owner", text: `Assalam-o-Alaikum! Thanks for reaching out regarding "${listing.title}". Feel free to ask any details.` }
    ]);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const newMsgs = [...chatMessages, { sender: "tenant", text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput("");

    // Simulate owner replying automatically
    setTimeout(() => {
      setChatMessages([
        ...newMsgs,
        { sender: "owner", text: "Jee bilkul, direct contact coordinates available hain. Verification features checking is safe. Aap visit kab karna chahenge?" }
      ]);
    }, 1500);
  };

  // Rental Agreement PDF Generator Logic
  const handleGenerateAgreement = (e) => {
    e.preventDefault();
    if (!agOwnerName || !agTenantName || !agPropAddress || !agRent) {
      alert("Please enter the critical information to generate the stamp contract.");
      return;
    }
    const stampCode = "PK-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedAgreement({
      ownerName: agOwnerName,
      ownerCnic: agOwnerCnic || "37405-1234567-1",
      tenantName: agTenantName,
      tenantCnic: agTenantCnic || "37405-7654321-2",
      address: agPropAddress,
      rent: parseFloat(agRent),
      deposit: parseFloat(agDeposit) || parseFloat(agRent) * 2,
      duration: agDuration,
      stampId: stampCode,
      date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearchCity("");
    setSearchArea("");
    setSearchCategory("");
    setSearchMinRent("");
    setSearchMaxRent("");
    setSearchText("");
    setFamilyOnly(false);
    setBachelorAllowed(false);
    setFurnished("Any");
    setParkingAvailable(false);
    setGeneratorBackup(false);
    setSolarInstalled(false);
    setAiFeedback("");
    setAiQuery("");
    fetchListings({
      city: "",
      area: "",
      category: "",
      minRent: "",
      maxRent: "",
      search: "",
      familyOnly: "false",
      bachelorAllowed: "false",
      furnished: "Any",
      parkingAvailable: "false",
      generatorBackup: "false",
      solarInstalled: "false"
    });
  };

  const openListingDetails = (listing) => {
    if (!listing) return;
    setSelectedListing(listing);
    setCalcRent(listing.rent);
    setCalcDeposit(listing.deposit);
    setCalcAdvance(listing.rent);
    if (!viewHistory.some(item => item.id === listing.id)) {
      setViewHistory([listing, ...viewHistory].slice(0, 5));
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`} suppressHydrationWarning>
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("home")}>
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-emerald-500/20">
              O2R
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Owner<span className="text-emerald-500">To</span>Renter</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bina Broker, Direct Rabta</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Agreement Generator Button */}
            <button
              onClick={() => setCurrentView("agreement-generator")}
              className="hidden lg:flex items-center gap-2 px-3.5 h-10 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Rent Agreement Generator</span>
            </button>

            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                document.documentElement.classList.toggle("dark");
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="hidden sm:flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                {user.role === "owner" && (
                  <button
                    onClick={() => setCurrentView("add-listing")}
                    className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/10"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Property</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg border border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setShowAuthModal(true); setAuthTab("login"); }}
                className="flex items-center gap-2 px-5 h-10 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT ROUTER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === "home" && (
          <div className="space-y-12">
            
            {/* HERO SECTION */}
            <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white py-16 px-6 sm:px-12 text-center shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80')" }} />
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Commission Free & Direct Contacts
                </span>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                  Rent par dena ya lena?<br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Owner se direct rabta karein</span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
                  "Owner se direct rent par lo." Zero broker, zero middleman charges. Houses, apartments, cars, offices, and warehouses all across Pakistan.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button 
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                        setAuthTab("login");
                      } else if (user.role === 'owner') {
                        setCurrentView("add-listing");
                      } else {
                        alert("Tenant accounts cannot add listings. Register/Log in as an Owner.");
                      }
                    }} 
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
                  >
                    Property Add Karein
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById("search-form-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }} 
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-xl transition-all"
                  >
                    Rent Par Talash Karein
                  </button>
                </div>
              </div>
            </section>

            {/* AI NATURAL LANGUAGE ASSISTANT SEARCH BOX */}
            <section className="premium-card p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/20 shadow-xl text-white">
              <form onSubmit={handleAiQuerySubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base">Smart AI Listing Finder (Rawalpindi / Islamabad)</h3>
                </div>
                <p className="text-xs text-slate-300">Type your rental request in natural English or Urdu. The AI system will automatically detect constraints and filter properties.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="e.g. Mujhe F-11 main 80 hazar budget tak fully furnished apartment chahiye"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Zap className="w-4 h-4 text-emerald-200" /> Apply AI Filter
                  </button>
                </div>
                {aiFeedback && (
                  <p className="text-xs font-semibold text-emerald-300 bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-900/40">{aiFeedback}</p>
                )}
              </form>
            </section>

            {/* RENT ESTIMATOR PANEL & move cost CALCULATOR (SIDE-BY-SIDE IN ONE BLOCK) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rent Estimator */}
              <div className="premium-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-emerald-500" />
                  <span>Real Rent Range Estimator</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Calculate market averages based on recent verified properties listed in that city segment.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">City</label>
                      <select
                        value={estCity}
                        onChange={(e) => setEstCity(e.target.value)}
                        className="w-full h-10 px-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        {PAK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Area</label>
                      <input
                        type="text"
                        placeholder="e.g. F-11, DHA"
                        value={estArea}
                        onChange={(e) => setEstArea(e.target.value)}
                        className="w-full h-10 px-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Category</label>
                      <select
                        value={estCat}
                        onChange={(e) => setEstCat(e.target.value)}
                        className="w-full h-10 px-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Office">Office</option>
                        <option value="Shop">Shop</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleEstimateRent}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Estimate Average Rent
                  </button>

                  {estimatedRent && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-xl space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Estimated rent range for {estArea}, {estCity}:</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Rs. {estimatedRent.min.toLocaleString()} – {estimatedRent.max.toLocaleString()}</span>
                        <span className="text-xs px-2 py-1 bg-emerald-600 text-white rounded font-bold">Average: Rs. {estimatedRent.avg.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Move-in Cost Calculator */}
              <div className="premium-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <span>Total Move-in Cost Calculator</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Estimate total initial funding required to start renting this property.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Monthly Rent (PKR)</label>
                    <input
                      type="number"
                      value={calcRent}
                      onChange={(e) => setCalcRent(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Security Deposit</label>
                    <input
                      type="number"
                      value={calcDeposit}
                      onChange={(e) => setCalcDeposit(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Advance Rent Months</label>
                    <select
                      value={calcAdvance}
                      onChange={(e) => setCalcAdvance(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value={0}>No Advance</option>
                      <option value={calcRent}>1 Month Rent</option>
                      <option value={calcRent * 2}>2 Months Rent</option>
                      <option value={calcRent * 3}>3 Months Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Other Utilities Deposit</label>
                    <input
                      type="number"
                      value={calcUtilities}
                      onChange={(e) => setCalcUtilities(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Estimated Total:</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">PKR {(calcDeposit + calcAdvance + calcUtilities).toLocaleString()}</span>
                </div>
              </div>
            </section>

            {/* SEARCH SECTION WITH SMART FILTERS */}
            <section id="search-form-section" className="premium-card p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Search className="w-5 h-5 text-emerald-500" />
                    <span>Search Filters</span>
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleClearFilters}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* City Select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">City</label>
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">All Cities</option>
                      {PAK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Area Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Area / Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. F-11, DHA, Saddar"
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>

                  {/* Min Rent */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Min Rent (PKR)</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchMinRent}
                      onChange={(e) => setSearchMinRent(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Max Rent */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Max Rent (PKR)</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchMaxRent}
                      onChange={(e) => setSearchMaxRent(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SMART FILTERS ACCORDION */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Smart Search Filters</span>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={familyOnly} onChange={() => setFamilyOnly(!familyOnly)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Family Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={bachelorAllowed} onChange={() => setBachelorAllowed(!bachelorAllowed)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Bachelor Allowed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={parkingAvailable} onChange={() => setParkingAvailable(!parkingAvailable)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Parking Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={generatorBackup} onChange={() => setGeneratorBackup(!generatorBackup)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Generator Backup</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={solarInstalled} onChange={() => setSolarInstalled(!solarInstalled)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Solar Installed</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Furnishing:</span>
                      <select 
                        value={furnished} 
                        onChange={(e) => setFurnished(e.target.value)}
                        className="rounded border border-slate-200 dark:border-slate-800 bg-transparent text-xs p-1 focus:outline-none"
                      >
                        <option value="Any">Any</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search listings by title, keywords or details..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-8 h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </section>

            {/* CATEGORIES GRID */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Browse Categories</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSearchCategory(cat.name);
                        fetchListings({
                          city: searchCity,
                          area: searchArea,
                          category: cat.name,
                          minRent: searchMinRent,
                          maxRent: searchMaxRent,
                          search: searchText,
                          familyOnly: familyOnly.toString(),
                          bachelorAllowed: bachelorAllowed.toString(),
                          furnished: furnished,
                          parkingAvailable: parkingAvailable.toString(),
                          generatorBackup: generatorBackup.toString(),
                          solarInstalled: solarInstalled.toString()
                        });
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${searchCategory === cat.name ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-600 text-slate-700 dark:text-slate-300"}`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-semibold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* SWITCH FEED TABS (PROPERTIES vs TENANT REQUIREMENTS) */}
            <section className="space-y-6">
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setFeedTab("listings")}
                  className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${feedTab === "listings" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  <Building className="w-4 h-4" /> Properties for Rent ({listings.length})
                </button>
                <button
                  onClick={() => setFeedTab("requests")}
                  className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${feedTab === "requests" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  <FileText className="w-4 h-4" /> Tenant Requirements Board ({tenantRequests.length})
                </button>
              </div>

              {/* PROPERTIES FEED */}
              {feedTab === "listings" && (
                <div className="space-y-6">
                  {/* View Controls & Map Toggle */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">Latest direct listings matching criteria</span>
                    <div className="flex rounded-lg border overflow-hidden text-xs">
                      <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 font-bold ${viewMode === "grid" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"}`}>List View</button>
                      <button onClick={() => setViewMode("map")} className={`px-3 py-1.5 font-bold ${viewMode === "map" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"}`}>Map View</button>
                    </div>
                  </div>

                  {viewMode === "grid" ? (
                    loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-[380px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        ))}
                      </div>
                    ) : listings.length === 0 ? (
                      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No listings found matching your search filters.</p>
                        <button onClick={handleClearFilters} className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                          Reset all filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {listings.map((item, index) => {
                          const isFeatured = item.rent > 150000 || item.id === 1;
                          return (
                            <React.Fragment key={item.id}>
                              <div className={`premium-card rounded-2xl overflow-hidden flex flex-col h-[400px] transition-all relative ${isFeatured ? "border-2 border-amber-500 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 shadow-amber-500/10 shadow-lg animate-fade-in" : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}`}>
                                {/* Image block */}
                                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => openListingDetails(item)}>
                                  <img
                                    src={item.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                                    {isFeatured ? (
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-md uppercase tracking-wider">
                                        ⭐ Featured listing
                                      </span>
                                    ) : null}
                                    {item.owner_verified ? (
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Owner
                                      </span>
                                    ) : null}
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-md">
                                      🚫 No Broker
                                    </span>
                                  </div>
                                  <div className="absolute top-3 right-3 flex gap-2">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                                      {item.category}
                                    </span>
                                  </div>

                                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                                    <span className="px-2.5 py-1 rounded-md text-[9px] font-bold bg-emerald-950/90 text-emerald-300 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" /> {item.availability || 'Now'}
                                    </span>
                                  </div>
                                </div>

                                {/* Content Block */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{item.area}, {item.city}</span>
                                      </div>
                                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                                        <Star className="w-3 h-3 fill-amber-500" />
                                        <span>{item.rating || '5.0'}</span>
                                      </div>
                                    </div>
                                    <h3 
                                      className="font-bold text-base line-clamp-2 hover:text-emerald-500 cursor-pointer transition-colors"
                                      onClick={() => openListingDetails(item)}
                                    >
                                      {item.title}
                                    </h3>
                                  </div>

                                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Monthly Rent</span>
                                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Rs. {item.rent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSaveListing(item)}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 text-slate-500 hover:text-red-500 transition-all"
                                        title="Save Listing"
                                      >
                                        <Heart className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => openListingDetails(item)}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-all"
                                      >
                                        Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* AD PLACEHOLDER SLOT AFTER 3RD CARD */}
                              {index === 2 && (
                                <div className="premium-card rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center p-6 text-center h-[400px] relative animate-fade-in">
                                  <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-slate-400 uppercase">Sponsored Ad</span>
                                  
                                  <div className="w-full flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
                                      <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Promote Your Property here</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[220px]">Get 10x more bookings by featuring your listing at the top of the board.</p>

                                    <button 
                                      onClick={() => {
                                        alert("Premium Listings: Contact support@ownertorenter.pk to get your property featured!");
                                      }}
                                      className="mt-6 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-emerald-600/10"
                                    >
                                      Feature Your Property
                                    </button>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    /* INTERACTIVE MAP PREVIEW MOCKUP */
                    <div className="w-full h-[500px] rounded-3xl border overflow-hidden relative bg-slate-200 dark:bg-slate-900 flex">
                      <div className="flex-1 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')" }}>
                        {/* Mapped Markers */}
                        {listings[0] && (
                          <div className="absolute top-[25%] left-[45%] p-2 bg-emerald-600 text-white rounded-lg shadow-lg font-bold text-xs cursor-pointer" onClick={() => openListingDetails(listings[0])}>
                            Rs. {listings[0].rent.toLocaleString()}
                          </div>
                        )}
                        {listings[1] && (
                          <div className="absolute top-[45%] left-[30%] p-2 bg-emerald-600 text-white rounded-lg shadow-lg font-bold text-xs cursor-pointer" onClick={() => openListingDetails(listings[1])}>
                            Rs. {listings[1].rent.toLocaleString()}
                          </div>
                        )}
                        {listings[2] && (
                          <div className="absolute top-[60%] left-[55%] p-2 bg-emerald-600 text-white rounded-lg shadow-lg font-bold text-xs cursor-pointer" onClick={() => openListingDetails(listings[2])}>
                            Rs. {listings[2].rent.toLocaleString()}
                          </div>
                        )}
                        
                        {/* Map Overlay Controls */}
                        <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-white/90 dark:bg-slate-950/90 text-xs text-slate-700 dark:text-slate-300 max-w-sm shadow-xl backdrop-blur-md">
                          <p className="font-bold flex items-center gap-1.5"><Map className="w-4 h-4 text-emerald-500" /> Interactive Map Search</p>
                          <p className="mt-1">Drag the map. Mapped pins sync directly. Click any pin to open details panel.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TENANT REQUIREMENTS BOARD */}
              {feedTab === "requests" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Rent demands posted by verified tenants looking for direct owners.</span>
                    <button
                      onClick={() => {
                        if (!user) {
                          setShowAuthModal(true);
                          setAuthTab("login");
                        } else {
                          setShowReqModal(true);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-emerald-500"
                    >
                      Post Requirement
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tenantRequests.map(req => (
                      <div key={req.id} className="premium-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40">{req.category} Wanted</span>
                            <h3 className="font-bold text-base mt-2">{req.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {req.area}, {req.city}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Budget / Month</span>
                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">Rs. {req.budget.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t flex justify-between items-center">
                          <span className="text-xs text-slate-500">Posted by: <strong>{req.tenant_name}</strong></span>
                          <a
                            href={`tel:${req.phone}`}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Tenant
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* RENT AGREEMENT GENERATOR VIEW */}
        {currentView === "agreement-generator" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-8 h-8 text-emerald-500" /> Legal Rental Agreement Generator
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate a standard direct tenancy contract agreement instantly, print-ready, matching Pakistani tenancy laws.</p>
              </div>

              <form onSubmit={handleGenerateAgreement} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-sm border-b pb-2 text-emerald-500">First Party (Owner) Details</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Owner Name *</label>
                    <input type="text" required placeholder="Ali Khan" value={agOwnerName} onChange={(e) => setAgOwnerName(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Owner CNIC *</label>
                    <input type="text" required placeholder="37405-XXXXXXX-X" value={agOwnerCnic} onChange={(e) => setAgOwnerCnic(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm border-b pb-2 text-emerald-500">Second Party (Tenant) Details</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tenant Name *</label>
                    <input type="text" required placeholder="Hamza Ahmed" value={agTenantName} onChange={(e) => setAgTenantName(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tenant CNIC *</label>
                    <input type="text" required placeholder="37405-XXXXXXX-X" value={agTenantCnic} onChange={(e) => setAgTenantCnic(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-bold text-sm border-b pb-2 text-emerald-500">Property & Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Property Full Address *</label>
                      <input type="text" required placeholder="House 123, Street 4, Sector F-11/1, Islamabad" value={agPropAddress} onChange={(e) => setAgPropAddress(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Tenancy Duration</label>
                      <select value={agDuration} onChange={(e) => setAgDuration(e.target.value)} className="w-full h-11 px-2 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none">
                        <option value="11 Months">11 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Monthly Rent (PKR) *</label>
                      <input type="number" required placeholder="75000" value={agRent} onChange={(e) => setAgRent(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Security Deposit *</label>
                      <input type="number" required placeholder="150000" value={agDeposit} onChange={(e) => setAgDeposit(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 flex gap-4">
                  <button type="button" onClick={() => setCurrentView("home")} className="flex-1 h-12 border rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all">Generate Stamp Tenancy Agreement</button>
                </div>
              </form>
            </div>

            {/* Stamp Paper Render Layout */}
            {generatedAgreement && (
              <div className="bg-amber-50/90 text-slate-950 border border-amber-200 p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 max-w-3xl mx-auto relative font-serif select-none" id="agreement-printable-area">
                {/* Stamp header */}
                <div className="text-center space-y-2 border-b-4 border-double border-red-800 pb-6">
                  <div className="mx-auto h-20 w-20 rounded-full border-4 border-red-800 flex items-center justify-center text-red-800 font-extrabold text-sm uppercase">
                    Tenancy
                  </div>
                  <h2 className="text-2xl font-bold uppercase text-red-800 tracking-wider">Government of Pakistan</h2>
                  <p className="text-xs tracking-widest text-slate-500 uppercase font-bold">Stamp Tenancy Duty ID: {generatedAgreement.stampId}</p>
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm leading-relaxed text-justify">
                  <h3 className="text-center font-bold text-base underline">RENTAL TENANCY AGREEMENT</h3>
                  
                  <p>
                    This Rental Tenancy Agreement is entered into on this <strong>{generatedAgreement.date}</strong> by and between:
                  </p>
                  
                  <p className="pl-4">
                    <strong>1. FIRST PARTY (LANDLORD/OWNER):</strong> {generatedAgreement.ownerName}, bearing CNIC No. <strong>{generatedAgreement.ownerCnic}</strong>, resident of Pakistan.
                  </p>
                  
                  <p className="pl-4">
                    <strong>2. SECOND PARTY (TENANT):</strong> {generatedAgreement.tenantName}, bearing CNIC No. <strong>{generatedAgreement.tenantCnic}</strong>, resident of Pakistan.
                  </p>

                  <p>
                    WHEREAS the Landlord is the legal owner of the premises located at <strong>{generatedAgreement.address}</strong> and agrees to let out the same to the Tenant on the terms and conditions outlined below:
                  </p>

                  <ul className="list-decimal pl-6 space-y-2">
                    <li>The tenancy shall be for a fixed term of <strong>{generatedAgreement.duration}</strong> commencing from this date.</li>
                    <li>The monthly rent is fixed at <strong>Rs. {generatedAgreement.rent.toLocaleString()}</strong>, payable in advance by the 5th of each calendar month.</li>
                    <li>The Tenant has deposited a sum of <strong>Rs. {generatedAgreement.deposit.toLocaleString()}</strong> as a refundable security deposit to the Landlord.</li>
                    <li>This agreement is subject to the ban of real estate broker interventions as verified on the OwnerToRenter platform.</li>
                  </ul>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs">
                  <div className="space-y-6">
                    <div className="border-b border-slate-900 mx-auto w-44 h-8 flex items-center justify-center italic text-slate-600 font-sans">Ali Khan (Digitally Signed)</div>
                    <span className="font-bold block">First Party (Landlord)</span>
                  </div>
                  <div className="space-y-6">
                    <div className="border-b border-slate-900 mx-auto w-44 h-8 flex items-center justify-center italic text-slate-600 font-sans">Hamza Ahmed (Digitally Signed)</div>
                    <span className="font-bold block">Second Party (Tenant)</span>
                  </div>
                </div>

                <div className="flex justify-center pt-8 border-t border-slate-200 select-all">
                  <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 font-sans">
                    <Printer className="w-4 h-4" /> Print Tenancy Document
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {currentView === "dashboard" && user && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome, {user.name}!</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Account Type: <span className="font-semibold text-emerald-500 capitalize">{user.role}</span> {user.verified && "✓ Verified"}</p>
              </div>
              <div className="flex gap-3">
                {user.role === "owner" && (
                  <button
                    onClick={() => setCurrentView("add-listing")}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Listing
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> Log Out
                </button>
              </div>
            </div>

            {/* TAB CONTAINER */}
            <div className="space-y-6">
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                {user.role === "owner" ? (
                  <button
                    onClick={() => setDashboardTab("my-listings")}
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${dashboardTab === "my-listings" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                  >
                    My Property Listings ({myListings.length})
                  </button>
                ) : (
                  <button
                    onClick={() => setDashboardTab("saved")}
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${dashboardTab === "saved" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                  >
                    Saved Listings ({favorites.length})
                  </button>
                )}
                <button
                  onClick={() => setDashboardTab("history")}
                  className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${dashboardTab === "history" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  Recently Viewed ({viewHistory.length})
                </button>
              </div>

              {/* LISTINGS CONTAINER */}
              {dashboardTab === "my-listings" && user.role === "owner" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myListings.map(item => (
                    <div key={item.id} className="premium-card rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
                      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">{item.category}</span>
                          <h4 className="font-bold text-base mt-1 line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.area}, {item.city}</p>
                          <p className="text-base font-extrabold text-slate-900 dark:text-white mt-2">Rs. {item.rent.toLocaleString()}/mo</p>
                        </div>
                        <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => openListingDetails(item)}
                            className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg text-center"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteListing(item.id)}
                            className="p-2 border border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {myListings.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl">
                      <p className="text-slate-500 font-medium">You haven't added any listings yet.</p>
                      <button onClick={() => setCurrentView("add-listing")} className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                        Create first listing now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {dashboardTab === "saved" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {favorites.map(item => (
                    <div key={item.id} className="premium-card rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
                      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-base line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.area}, {item.city}</p>
                          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">Rs. {item.rent.toLocaleString()}/mo</p>
                        </div>
                        <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => openListingDetails(item)}
                            className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg text-center"
                          >
                            Details
                          </button>
                          <button
                            onClick={async () => {
                              const token = localStorage.getItem("token");
                              try {
                                await fetch(`${BACKEND_URL}/listings/${item.id}/favorite`, {
                                  method: "DELETE",
                                  headers: { "Authorization": `Bearer ${token}` }
                                });
                              } catch(e) {}
                              const updated = favorites.filter(f => f.id !== item.id);
                              setFavorites(updated);
                              localStorage.setItem(`favs_${user.id}`, JSON.stringify(updated));
                            }}
                            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {favorites.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl">
                      <p className="text-slate-500 font-medium">You haven't saved any listings yet.</p>
                      <button onClick={() => setCurrentView("home")} className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                        Explore properties
                      </button>
                    </div>
                  )}
                </div>
              )}

              {dashboardTab === "history" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {viewHistory.map(item => (
                    <div key={item.id} className="premium-card rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
                      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-base line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.area}, {item.city}</p>
                          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">Rs. {item.rent.toLocaleString()}/mo</p>
                        </div>
                        <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => openListingDetails(item)}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg text-center"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {viewHistory.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl">
                      <p className="text-slate-500 font-medium">No browsing history found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADD LISTING FORM VIEW */}
        {currentView === "add-listing" && user && user.role === "owner" && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Add New Listing</h1>
            
            {listingError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{listingError}</span>
              </div>
            )}

            {listingSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-emerald-600 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{listingSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddListingSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-base font-bold border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spacious 1 Kanal Double Story House for Rent"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe facilities, nearby landmarks, availability details..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category *</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Availability Calendar *</label>
                    <select value={newAvailability} onChange={(e) => setNewAvailability(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm">
                      <option value="Now">Available Now</option>
                      <option value="Next Month">Available Next Month</option>
                      <option value="Rented">Already Rented</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SMART FILTERS */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold pb-2">Smart Attributes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newFamilyOnly} onChange={() => setNewFamilyOnly(!newFamilyOnly)} className="rounded text-emerald-600" />
                    <span>Family Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newBachelorAllowed} onChange={() => setNewBachelorAllowed(!newBachelorAllowed)} className="rounded text-emerald-600" />
                    <span>Bachelors Allowed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newParking} onChange={() => setNewParking(!newParking)} className="rounded text-emerald-600" />
                    <span>Parking Slot Available</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newGenerator} onChange={() => setNewGenerator(!newGenerator)} className="rounded text-emerald-600" />
                    <span>Generator Backup</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newSolar} onChange={() => setNewSolar(!newSolar)} className="rounded text-emerald-600" />
                    <span>Solar Panels Installed</span>
                  </label>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Furnishing</label>
                    <select value={newFurnished} onChange={(e) => setNewFurnished(e.target.value)} className="rounded border bg-transparent p-1.5 w-full text-xs">
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold border-b pb-2">Location</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">City *</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    >
                      {PAK_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Area / Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. F-11/1, DHA Phase 2"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House 123, Street 4, Sector Name"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold border-b pb-2">Rent & Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Rent (PKR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={newRent}
                      onChange={(e) => setNewRent(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Security Deposit (PKR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 90000"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* VIDEO TOUR LINK */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold border-b pb-2">YouTube Video Tour (Optional)</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Video Link</label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold border-b pb-2">Listing Images</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Image URL 1</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImages[0]}
                    onChange={(e) => {
                      const updated = [...newImages];
                      updated[0] = e.target.value;
                      setNewImages(updated);
                    }}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 mb-3"
                  />
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Image URL 2</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImages[1]}
                    onChange={(e) => {
                      const updated = [...newImages];
                      updated[1] = e.target.value;
                      setNewImages(updated);
                    }}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-bold border-b pb-2">Direct Contact</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                    <input
                      type="text"
                      placeholder={user.phone}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">WhatsApp Number</label>
                    <input
                      type="text"
                      placeholder={user.phone}
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentView("dashboard")}
                  className="flex-1 h-12 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm">O2R</div>
            <span className="text-slate-900 dark:text-white font-bold">OwnerToRenter</span>
          </div>
          <p className="text-xs text-center md:text-left">© 2026 OwnerToRenter. Developed without commission models for Pakistan. All rights reserved.</p>
          <div className="flex gap-4 text-xs font-semibold">
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:text-emerald-500 transition-colors">Support Contact</Link>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* TAB SELECT */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setAuthTab("login")}
                className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${authTab === "login" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
              >
                Log In
              </button>
              <button
                onClick={() => setAuthTab("register-owner")}
                className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${authTab === "register-owner" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
              >
                Register Owner
              </button>
              <button
                onClick={() => setAuthTab("register-tenant")}
                className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-all ${authTab === "register-tenant" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
              >
                Register Tenant
              </button>
            </div>

            {authError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-emerald-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ali@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
                >
                  Log In
                </button>
              </form>
            )}

            {/* REGISTRATION FORM (OWNER & TENANT) */}
            {authTab !== "login" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mobile Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 300 1234567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="ali@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {authTab === "register-owner" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">CNIC Number</label>
                      <input
                        type="text"
                        required
                        placeholder="37405-XXXXXXX-X"
                        value={regCnic}
                        onChange={(e) => setRegCnic(e.target.value)}
                        className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City</label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500"
                      >
                        {PAK_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
                >
                  Register Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST TENANT REQUIREMENT MODAL */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button onClick={() => setShowReqModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-500" /> Post Your Requirement</h2>
            <form onSubmit={handlePostTenantRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Requirement Summary *</label>
                <input type="text" required placeholder="e.g. Need 2 Bed Portion or Apartment" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
                  <select value={reqCat} onChange={(e) => setReqCat(e.target.value)} className="w-full h-11 px-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950">
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">City</label>
                  <select value={reqCity} onChange={(e) => setReqCity(e.target.value)} className="w-full h-11 px-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950">
                    {PAK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Area / Sector *</label>
                  <input type="text" required placeholder="e.g. DHA Phase 2" value={reqArea} onChange={(e) => setReqArea(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Max Budget (PKR) *</label>
                  <input type="number" required placeholder="30000" value={reqBudget} onChange={(e) => setReqBudget(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Contact Number</label>
                <input type="text" placeholder={user?.phone} value={reqPhone} onChange={(e) => setReqPhone(e.target.value)} className="w-full h-11 px-3 rounded-lg border text-sm bg-slate-50 dark:bg-slate-950" />
              </div>
              <button type="submit" className="w-full h-11 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 shadow-md">Submit Requirement</button>
            </form>
          </div>
        </div>
      )}

      {/* BUILT-IN WEBSITE CHAT SIMULATOR DRAWER */}
      {chatOpen && chatOwner && (
        <div className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-950 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-sm">{chatOwner.owner_name} (Direct Chat)</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/20 text-xs">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "tenant" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}>
                {msg.sender === "system" ? (
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900 p-1.5 rounded">{msg.text}</span>
                ) : (
                  <div className={`p-2.5 rounded-lg max-w-[80%] ${msg.sender === "tenant" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-850 border text-slate-900 dark:text-slate-100"}`}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
            <input type="text" placeholder="Type message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 border dark:border-slate-800 dark:bg-slate-950 rounded-xl px-3 text-xs focus:outline-none" />
            <button type="submit" className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"><Send className="w-4.5 h-4.5" /></button>
          </form>
        </div>
      )}

      {/* DETAIL DRAWER / POPUP */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-900 shadow-2xl flex flex-col transition-transform duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-500 tracking-wider">{selectedListing.category} Listing</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 line-clamp-1">{selectedListing.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedListing(null)}
                className="p-2 border rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border">
                  <img
                    src={selectedListing.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedListing.images && selectedListing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedListing.images.map((url, i) => (
                      <div key={i} className="h-16 rounded-lg overflow-hidden border cursor-pointer">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Video Tour Section */}
              {selectedListing.video_url && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Video className="w-5 h-5 text-red-500" />
                    <div>
                      <span className="font-bold block text-slate-800 dark:text-slate-200">Video Tour Available</span>
                      <span className="text-slate-400">Watch walkthrough tour of this property.</span>
                    </div>
                  </div>
                  <a href={selectedListing.video_url} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow">
                    Play Video
                  </a>
                </div>
              )}

              {/* Rent Card */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 border p-5 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">Monthly Rent</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Rs. {selectedListing.rent.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">Security Deposit</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Rs. {selectedListing.deposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Smart Attributes Display */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Smart Attributes</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                  <div className={`p-2 rounded-lg border text-center ${selectedListing.family_only ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-slate-200'}`}>Family Only</div>
                  <div className={`p-2 rounded-lg border text-center ${selectedListing.bachelor_allowed ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-slate-200'}`}>Bachelors Allowed</div>
                  <div className="p-2 rounded-lg border border-slate-200 text-center capitalize">{selectedListing.furnished || 'Unfurnished'}</div>
                  <div className={`p-2 rounded-lg border text-center ${selectedListing.parking_available ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-slate-200'}`}>Parking Slots</div>
                  <div className={`p-2 rounded-lg border text-center ${selectedListing.generator_backup ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-slate-200'}`}>Generator Backup</div>
                  <div className={`p-2 rounded-lg border text-center ${selectedListing.solar_installed ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-slate-200'}`}>Solar System</div>
                </div>
              </div>

              {/* Area Insights (Nearby Locations) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Area Insights (Nearby Landmarks)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-start gap-2">
                    <MapPin className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-400">Public Transport</span>
                      <p className="mt-0.5">{selectedListing.metro_dist || "500m from nearest station"}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-start gap-2">
                    <Home className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-400">Schools</span>
                      <p className="mt-0.5">{selectedListing.school_dist || "300m from Beaconhouse"}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-start gap-2">
                    <Building className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-400">Hospitals</span>
                      <p className="mt-0.5">{selectedListing.hospital_dist || "1km from Hospital"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Description</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {selectedListing.description || "No description provided."}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Address</h4>
                <div className="flex gap-2 items-start text-sm">
                  <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedListing.area}, {selectedListing.city}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{selectedListing.address}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Services Mock Directory */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Emergency Home Services</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                  <a href="tel:123" className="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 block">⚡ Electrician</a>
                  <a href="tel:123" className="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 block">🪠 Plumber</a>
                  <a href="tel:123" className="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 block">🚚 Movers</a>
                  <a href="tel:123" className="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 block">🎨 Painters</a>
                </div>
              </div>

              {/* Owner Info & Direct Contact */}
              <div className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-extrabold text-emerald-600">
                    {selectedListing.owner_name ? selectedListing.owner_name[0] : "O"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{selectedListing.owner_name || "Owner"}</span>
                      {selectedListing.owner_verified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified Owner ⭐
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs text-slate-500">Contact directly, no commissions</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <a
                    href={`tel:${selectedListing.owner_phone || ""}`}
                    className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedListing.owner_phone ? selectedListing.owner_phone.replace(/\+/g, '').replace(/\s/g, '') : ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => openChatWithOwner(selectedListing)}
                    className="flex items-center justify-center gap-1.5 h-12 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-md transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Web Chat</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 flex gap-4">
              <button
                onClick={() => {
                  handleSaveListing(selectedListing);
                  alert("Listing Saved to Favorites!");
                }}
                className="flex-1 h-12 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>Save Property</span>
              </button>
              <button
                onClick={() => {
                  alert("Listing reported successfully. Our quality team will review it.");
                }}
                className="px-5 h-12 border border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold rounded-xl text-sm transition-all"
              >
                Report Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
