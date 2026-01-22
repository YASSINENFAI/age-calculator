// Global State
let currentLang = 'ar';
let isDarkMode = false;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSavedData();
    attachEventListeners();
});

function initializeApp() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'en') {
        toggleLanguage();
    }
}

function loadSavedData() {
    const savedBirthDate = localStorage.getItem('birthDate');
    if (savedBirthDate) {
        document.getElementById('birthDate').value = savedBirthDate;
    }
}

function attachEventListeners() {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Language Toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    
    // Calculate Button
    document.getElementById('calculateBtn').addEventListener('click', calculateAge);
    
    // Enter key on birth date input
    document.getElementById('birthDate').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateAge();
        }
    });
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const html = document.documentElement;
    
    if (currentLang === 'en') {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        document.querySelector('.lang-text').textContent = 'AR';
    } else {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        document.querySelector('.lang-text').textContent = 'EN';
    }
    
    // Update all translatable elements
    updateTranslations();
    localStorage.setItem('language', currentLang);
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

function calculateAge() {
    const birthDateInput = document.getElementById('birthDate').value;
    
    if (!birthDateInput) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال تاريخ الميلاد' : 'Please enter your birth date');
        return;
    }
    
    const birthDate = new Date(birthDateInput);
    const today = new Date();
    
    if (birthDate > today) {
        alert(currentLang === 'ar' ? 'تاريخ الميلاد لا يمكن أن يكون في المستقبل' : 'Birth date cannot be in the future');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('birthDate', birthDateInput);
    
    // Calculate age details
    const ageDetails = getAgeDetails(birthDate, today);
    
    // Display results
    displayResults(ageDetails, birthDate);
    
    // Show results section with animation
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getAgeDetails(birthDate, today) {
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days
    const timeDiff = today - birthDate;
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    
    // Calculate heartbeats (average 70 bpm)
    const heartbeats = Math.floor(totalMinutes * 70);
    
    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes,
        heartbeats
    };
}

function displayResults(ageDetails, birthDate) {
    // Display main age
    document.getElementById('years').textContent = ageDetails.years;
    document.getElementById('months').textContent = ageDetails.months;
    document.getElementById('days').textContent = ageDetails.days;
    
    // Display detailed stats
    document.getElementById('totalDays').textContent = ageDetails.totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = ageDetails.totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = ageDetails.totalMinutes.toLocaleString();
    document.getElementById('heartbeats').textContent = ageDetails.heartbeats.toLocaleString();
    
    // Calculate and display next birthday countdown
    displayNextBirthdayCountdown(birthDate);
    
    // Display zodiac sign
    displayZodiacSign(birthDate);
}

function displayNextBirthdayCountdown(birthDate) {
    const today = new Date();
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If birthday has passed this year, get next year's birthday
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const timeDiff = nextBirthday - today;
    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const monthsRemaining = Math.floor(daysRemaining / 30);
    const daysInMonth = daysRemaining % 30;
    
    document.getElementById('countMonths').textContent = monthsRemaining;
    document.getElementById('countDays').textContent = daysInMonth;
    document.getElementById('countHours').textContent = hoursRemaining;
    
    // Display next birthday date
    const dateStr = nextBirthday.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('nextBirthdayDate').textContent = dateStr;
}

function displayZodiacSign(birthDate) {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    const zodiacSigns = {
        ar: ['الجدي', 'الدلو', 'الحوت', 'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس'],
        en: ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius']
    };
    
    let signIndex;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) signIndex = 1;
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) signIndex = 2;
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) signIndex = 3;
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) signIndex = 4;
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) signIndex = 5;
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) signIndex = 6;
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) signIndex = 7;
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) signIndex = 8;
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) signIndex = 9;
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) signIndex = 10;
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) signIndex = 11;
    else signIndex = 0;
    
    document.getElementById('zodiacSign').textContent = zodiacSigns[currentLang][signIndex];
}
