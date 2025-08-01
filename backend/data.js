// ملف البيانات - يحتوي على جميع الدروس والكلمات والجمل
// هذا الملف يمكن استبداله بقاعدة بيانات في المشاريع الأكبر

const lessonsData = {
  // مصفوفة الفصول الرئيسية
  chapters: [
    {
      id: 1,
      title: "الأساسيات",
      title_en: "Basics",
      description: "تعلم الكلمات والعبارات الأساسية",
      description_en: "Learn basic words and phrases",
      lessons: [1, 2, 3] // أرقام الدروس في هذا الفصل
    },
    {
      id: 2,
      title: "المحادثة اليومية",
      title_en: "Daily Conversation",
      description: "عبارات مفيدة للاستخدام اليومي",
      description_en: "Useful phrases for daily use",
      lessons: [4, 5]
    },
    {
      id: 3,
      title: "السفر والسياحة",
      title_en: "Travel & Tourism",
      description: "كلمات وعبارات مفيدة للسفر",
      description_en: "Useful words and phrases for travel",
      lessons: [6]
    }
  ],

  // مصفوفة الدروس التفصيلية
  lessons: [
    {
      id: 1,
      chapterId: 1,
      title: "التحيات والسلام",
      title_en: "Greetings",
      description: "تعلم كيفية السلام والتحية",
      description_en: "Learn how to greet people",
      words: [
        {
          id: 1,
          english: "Hello",
          arabic: "مرحبا",
          pronunciation: "Hello",
          example_en: "Hello, how are you?",
          example_ar: "مرحبا، كيف حالك؟"
        },
        {
          id: 2,
          english: "Goodbye",
          arabic: "وداعا",
          pronunciation: "Goodbye",
          example_en: "Goodbye, see you later!",
          example_ar: "وداعا، أراك لاحقا!"
        },
        {
          id: 3,
          english: "Good morning",
          arabic: "صباح الخير",
          pronunciation: "Good morning",
          example_en: "Good morning, everyone!",
          example_ar: "صباح الخير للجميع!"
        },
        {
          id: 4,
          english: "Good evening",
          arabic: "مساء الخير",
          pronunciation: "Good evening",
          example_en: "Good evening, sir!",
          example_ar: "مساء الخير، سيدي!"
        },
        {
          id: 5,
          english: "Thank you",
          arabic: "شكرا لك",
          pronunciation: "Thank you",
          example_en: "Thank you for your help!",
          example_ar: "شكرا لك على مساعدتك!"
        }
      ]
    },
    {
      id: 2,
      chapterId: 1,
      title: "الأرقام",
      title_en: "Numbers",
      description: "تعلم الأرقام من 1 إلى 10",
      description_en: "Learn numbers from 1 to 10",
      words: [
        {
          id: 6,
          english: "One",
          arabic: "واحد",
          pronunciation: "One",
          example_en: "I have one book",
          example_ar: "لدي كتاب واحد"
        },
        {
          id: 7,
          english: "Two",
          arabic: "اثنان",
          pronunciation: "Two",
          example_en: "Two cats are playing",
          example_ar: "قطتان تلعبان"
        },
        {
          id: 8,
          english: "Three",
          arabic: "ثلاثة",
          pronunciation: "Three",
          example_en: "Three birds in the sky",
          example_ar: "ثلاثة طيور في السماء"
        },
        {
          id: 9,
          english: "Four",
          arabic: "أربعة",
          pronunciation: "Four",
          example_en: "Four seasons in a year",
          example_ar: "أربعة فصول في السنة"
        },
        {
          id: 10,
          english: "Five",
          arabic: "خمسة",
          pronunciation: "Five",
          example_en: "Five fingers on my hand",
          example_ar: "خمسة أصابع في يدي"
        }
      ]
    },
    {
      id: 3,
      chapterId: 1,
      title: "الألوان",
      title_en: "Colors",
      description: "تعلم الألوان الأساسية",
      description_en: "Learn basic colors",
      words: [
        {
          id: 11,
          english: "Red",
          arabic: "أحمر",
          pronunciation: "Red",
          example_en: "The apple is red",
          example_ar: "التفاحة حمراء"
        },
        {
          id: 12,
          english: "Blue",
          arabic: "أزرق",
          pronunciation: "Blue",
          example_en: "The sky is blue",
          example_ar: "السماء زرقاء"
        },
        {
          id: 13,
          english: "Green",
          arabic: "أخضر",
          pronunciation: "Green",
          example_en: "The grass is green",
          example_ar: "العشب أخضر"
        },
        {
          id: 14,
          english: "Yellow",
          arabic: "أصفر",
          pronunciation: "Yellow",
          example_en: "The sun is yellow",
          example_ar: "الشمس صفراء"
        }
      ]
    },
    {
      id: 4,
      chapterId: 2,
      title: "في المطعم",
      title_en: "At the Restaurant",
      description: "عبارات مفيدة في المطعم",
      description_en: "Useful phrases at the restaurant",
      words: [
        {
          id: 15,
          english: "Menu",
          arabic: "قائمة الطعام",
          pronunciation: "Menu",
          example_en: "Can I see the menu, please?",
          example_ar: "هل يمكنني رؤية قائمة الطعام، من فضلك؟"
        },
        {
          id: 16,
          english: "Water",
          arabic: "ماء",
          pronunciation: "Water",
          example_en: "I would like some water",
          example_ar: "أريد بعض الماء"
        },
        {
          id: 17,
          english: "Food",
          arabic: "طعام",
          pronunciation: "Food",
          example_en: "The food is delicious",
          example_ar: "الطعام لذيذ"
        }
      ]
    },
    {
      id: 5,
      chapterId: 2,
      title: "التسوق",
      title_en: "Shopping",
      description: "عبارات مفيدة أثناء التسوق",
      description_en: "Useful phrases while shopping",
      words: [
        {
          id: 18,
          english: "Price",
          arabic: "سعر",
          pronunciation: "Price",
          example_en: "What is the price?",
          example_ar: "ما هو السعر؟"
        },
        {
          id: 19,
          english: "Money",
          arabic: "نقود",
          pronunciation: "Money",
          example_en: "Do you have money?",
          example_ar: "هل لديك نقود؟"
        },
        {
          id: 20,
          english: "Buy",
          arabic: "شراء",
          pronunciation: "Buy",
          example_en: "I want to buy this",
          example_ar: "أريد شراء هذا"
        }
      ]
    },
    {
      id: 6,
      chapterId: 3,
      title: "في المطار",
      title_en: "At the Airport",
      description: "عبارات مفيدة في المطار والسفر",
      description_en: "Useful phrases at the airport and travel",
      words: [
        {
          id: 21,
          english: "Airport",
          arabic: "مطار",
          pronunciation: "Airport",
          example_en: "Where is the airport?",
          example_ar: "أين المطار؟"
        },
        {
          id: 22,
          english: "Ticket",
          arabic: "تذكرة",
          pronunciation: "Ticket",
          example_en: "I need a ticket",
          example_ar: "أحتاج تذكرة"
        },
        {
          id: 23,
          english: "Passport",
          arabic: "جواز سفر",
          pronunciation: "Passport",
          example_en: "Show me your passport",
          example_ar: "أرني جواز سفرك"
        }
      ]
    }
  ]
};

// تصدير البيانات لاستخدامها في الملفات الأخرى
module.exports = lessonsData;